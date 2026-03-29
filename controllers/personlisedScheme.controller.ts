// ==============================
// TYPES & INTERFACES
// ==============================

interface DataItem {
  id: number;
  name: string;
  age: number;
  category: string;
  city: string;
  salary: number;
  isActive: boolean;
  createdAt: Date;
}

interface Filters {
  category: string | null;
  city: string | null;
  isActive: boolean | null;
}

interface Sort {
  field: keyof DataItem | null;
  order: "asc" | "desc";
}

interface AppState {
  data: DataItem[];
  filteredData: DataItem[];
  page: number;
  limit: number;
  total: number;
  searchQuery: string;
  filters: Filters;
  sort: Sort;
}

interface ApiResponse {
  data: DataItem[];
  total: number;
  page: number;
  limit: number;
}

interface FakeApiFetchParams {
  page?: number;
  limit?: number;
}

const categories: string[] = [
  "Tech",
  "Finance",
  "Health",
  "Education",
  "Sports",
];
const cities: string[] = [
  "Delhi",
  "Mumbai",
  "Chandigarh",
  "Panipat",
  "Bangalore",
];

function generateFakeData(count: number = 500): DataItem[] {
  const data: DataItem[] = [];

  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      name: `User ${i}`,
      age: Math.floor(Math.random() * 50) + 18,
      category: categories[Math.floor(Math.random() * categories.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      salary: Math.floor(Math.random() * 100000),
      isActive: Math.random() > 0.5,
      createdAt: new Date(Date.now() - Math.random() * 10000000000),
    });
  }

  return data;
}

const DATABASE: DataItem[] = generateFakeData(1000);

function fakeApiFetch(params: FakeApiFetchParams): Promise<ApiResponse> {
  const { page = 1, limit = 20 } = params;
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;

      resolve({
        data: DATABASE.slice(start, end),
        total: DATABASE.length,
        page,
        limit,
      });
    }, 500);
  });
}

const state: AppState = {
  data: [],
  filteredData: [],
  page: 1,
  limit: 20,
  total: 0,
  searchQuery: "",
  filters: {
    category: null,
    city: null,
    isActive: null,
  },
  sort: {
    field: null,
    order: "asc",
  },
};

async function fetchData(): Promise<void> {
  console.log("Fetching data...");
  const response = await fakeApiFetch({
    page: state.page,
    limit: state.limit,
  });

  state.data = response.data;
  state.total = response.total;

  applyAllOperations();
}

// ==============================
// SEARCH FUNCTION
// ==============================

function searchData(data: DataItem[], query: string): DataItem[] {
  if (!query) return data;

  return data.filter((item) => {
    return (
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.city.toLowerCase().includes(query.toLowerCase())
    );
  });
}

// ==============================
// FILTER FUNCTION
// ==============================

function filterData(data: DataItem[], filters: Filters): DataItem[] {
  return data.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.city && item.city !== filters.city) return false;
    if (filters.isActive !== null && item.isActive !== filters.isActive)
      return false;

    return true;
  });
}

// ==============================
// SORT FUNCTION
// ==============================

function sortData(data: DataItem[], sort: Sort): DataItem[] {
  if (!sort.field) return data;

  return [...data].sort((a, b) => {
    const aVal = a[sort.field as keyof DataItem];
    const bVal = b[sort.field as keyof DataItem];

    if (aVal < bVal) return sort.order === "asc" ? -1 : 1;
    if (aVal > bVal) return sort.order === "asc" ? 1 : -1;
    return 0;
  });
}

// ==============================
// APPLY ALL OPERATIONS
// ==============================

function applyAllOperations(): void {
  let result: DataItem[] = [...state.data];

  result = searchData(result, state.searchQuery);
  result = filterData(result, state.filters);
  result = sortData(result, state.sort);

  state.filteredData = result;

  render();
}

// ==============================
// PAGINATION CONTROLS
// ==============================

function nextPage(): void {
  state.page++;
  fetchData();
}

function prevPage(): void {
  if (state.page > 1) {
    state.page--;
    fetchData();
  }
}

// ==============================
// SETTERS
// ==============================

function setSearch(query: string): void {
  state.searchQuery = query;
  applyAllOperations();
}

function setFilter(key: keyof Filters, value: any): void {
  state.filters[key] = value;
  applyAllOperations();
}

function setSort(
  field: keyof DataItem | null,
  order: "asc" | "desc" = "asc",
): void {
  state.sort = { field, order };
  applyAllOperations();
}

// ==============================
// RENDER FUNCTION
// ==============================

function render(): void {
  console.clear();

  console.log("===== DATA TABLE =====");
  console.log(`Page: ${state.page}`);
  console.log(`Total: ${state.total}`);
  console.log(`Showing: ${state.filteredData.length} items`);

  console.table(state.filteredData);
}

// ==============================
// ADVANCED UTILITIES
// ==============================

// Debounce function for search optimization
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply( args), delay);
  };
}

const debouncedSearch = debounce(setSearch, 300);

// ==============================
// SIMULATION CONTROLS
// ==============================

async function simulateUserActions(): Promise<void> {
  await fetchData();

  setTimeout(() => {
    console.log("Searching for 'User 1'");
    debouncedSearch("User 1");
  }, 1000);

  setTimeout(() => {
    console.log("Filter by category: Tech");
    setFilter("category", "Tech");
  }, 2000);

  setTimeout(() => {
    console.log("Sorting by salary DESC");
    setSort("salary", "desc");
  }, 3000);

  setTimeout(() => {
    console.log("Next Page");
    nextPage();
  }, 4000);

  setTimeout(() => {
    console.log("Filter Active Users");
    setFilter("isActive", true);
  }, 5000);
}

// ==============================
// EXTRA: BULK OPERATIONS
// ==============================

function bulkDelete(ids: number[]): void {
  console.log("Deleting IDs:", ids);

  for (let id of ids) {
    const index = DATABASE.findIndex((item) => item.id === id);
    if (index !== -1) {
      DATABASE.splice(index, 1);
    }
  }

  fetchData();
}

function bulkUpdateCategory(ids: number[], newCategory: string): void {
  for (let item of DATABASE) {
    if (ids.includes(item.id)) {
      item.category = newCategory;
    }
  }

  fetchData();
}

// ==============================
// EXTRA: ANALYTICS
// ==============================

function getAnalytics(): void {
  const stats: Record<string, number> = {};

  for (let item of DATABASE) {
    if (!stats[item.category]) stats[item.category] = 0;
    stats[item.category]++;
  }

  console.log("Category Analytics:", stats);
}

// ==============================
// START APPLICATION
// ==============================

simulateUserActions();
