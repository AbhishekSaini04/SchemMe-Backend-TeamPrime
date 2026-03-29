-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "AreaType" AS ENUM ('URBAN', 'RURAL', 'SEMI_URBAN');

-- CreateEnum
CREATE TYPE "SocialCategory" AS ENUM ('GENERAL', 'OBC', 'SC', 'ST', 'OBC_NCL', 'EWS');

-- CreateEnum
CREATE TYPE "Occupation" AS ENUM ('STUDENT', 'FARMER', 'SALARIED_EMPLOYEE', 'SELF_EMPLOYED', 'BUSINESS_OWNER', 'DAILY_WAGE_WORKER', 'HOMEMAKER', 'SENIOR_CITIZEN', 'UNEMPLOYED', 'OTHER');

-- CreateEnum
CREATE TYPE "IncomeRange" AS ENUM ('BELOW_1_LAKH', 'BETWEEN_1_TO_3_LAKH', 'BETWEEN_3_TO_5_LAKH', 'BETWEEN_5_TO_10_LAKH', 'ABOVE_10_LAKH');

-- CreateTable
CREATE TABLE "otp" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "age" INTEGER NOT NULL,
    "maritalStatus" "MaritalStatus" NOT NULL,
    "areaType" "AreaType" NOT NULL,
    "state" TEXT NOT NULL,
    "socialCategory" "SocialCategory" NOT NULL,
    "isPwD" BOOLEAN NOT NULL,
    "disabilityType" TEXT,
    "disabilityPercentage" INTEGER,
    "occupation" "Occupation" NOT NULL,
    "isBPL" BOOLEAN NOT NULL,
    "annualIncome" "IncomeRange" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "age" INTEGER NOT NULL,
    "maritalStatus" "MaritalStatus" NOT NULL,
    "areaType" "AreaType" NOT NULL,
    "state" TEXT NOT NULL,
    "socialCategory" "SocialCategory" NOT NULL,
    "isPwD" BOOLEAN NOT NULL,
    "disabilityType" TEXT,
    "disabilityPercentage" INTEGER,
    "occupation" "Occupation" NOT NULL,
    "isBPL" BOOLEAN NOT NULL,
    "annualIncome" "IncomeRange" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scheme" (
    "id" SERIAL NOT NULL,
    "scheme_name" TEXT NOT NULL,
    "slug" TEXT,
    "details" TEXT,
    "benefits" TEXT,
    "eligibility" TEXT,
    "application" TEXT,
    "documents" TEXT,
    "level" TEXT,
    "schemeCategory" TEXT,
    "tags" TEXT,
    "level_name" TEXT,
    "search_tags" TEXT,

    CONSTRAINT "Scheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSchemes" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "schemeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedSchemes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otp_email_key" ON "otp"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SavedSchemes_userId_schemeId_key" ON "SavedSchemes"("userId", "schemeId");

-- AddForeignKey
ALTER TABLE "SavedSchemes" ADD CONSTRAINT "SavedSchemes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSchemes" ADD CONSTRAINT "SavedSchemes_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "Scheme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
