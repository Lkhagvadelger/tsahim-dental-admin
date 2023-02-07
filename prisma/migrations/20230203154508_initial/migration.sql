BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [emailVerified] DATETIME2,
    [passwordDigest] NVARCHAR(1000),
    [phoneNumber] NVARCHAR(1000) NOT NULL,
    [phoneNumberVerified] DATETIME2,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [User_email_key] UNIQUE ([email]),
    CONSTRAINT [User_phoneNumber_key] UNIQUE ([phoneNumber])
);

-- CreateTable
CREATE TABLE [dbo].[Session] (
    [id] NVARCHAR(1000) NOT NULL,
    [sid] NVARCHAR(1000) NOT NULL,
    [data] NVARCHAR(1000) NOT NULL,
    [expiresAt] DATETIME2 NOT NULL CONSTRAINT [Session_expiresAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Session_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [Session_sid_key] UNIQUE ([sid])
);

-- CreateTable
CREATE TABLE [dbo].[Person] (
    [id] NVARCHAR(1000) NOT NULL,
    [register] NVARCHAR(1000),
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [birthDate] DATETIME2 NOT NULL,
    [phoneNumber] NVARCHAR(1000) NOT NULL,
    [phoneNumberVerified] DATETIME2,
    [age] INT NOT NULL,
    [gender] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    [address] NVARCHAR(1000),
    [note] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Person_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Person_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [Person_phoneNumber_key] UNIQUE ([phoneNumber])
);

-- CreateTable
CREATE TABLE [dbo].[Patient] (
    [id] NVARCHAR(1000) NOT NULL,
    [cardNumber] INT NOT NULL,
    [personId] NVARCHAR(1000) NOT NULL,
    [profession] NVARCHAR(1000),
    [engagementTypeId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Patient_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Patient_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [Patient_cardNumber_key] UNIQUE ([cardNumber])
);

-- CreateTable
CREATE TABLE [dbo].[FamilyMember] (
    [id] NVARCHAR(1000) NOT NULL,
    [initPatientId] NVARCHAR(1000) NOT NULL,
    [targetPatientId] NVARCHAR(1000) NOT NULL,
    [relation] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [FamilyMember_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [FamilyMember_pkey] PRIMARY KEY ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Doctor] (
    [id] NVARCHAR(1000) NOT NULL,
    [bank] NVARCHAR(1000) NOT NULL,
    [bankAccount] NVARCHAR(1000) NOT NULL,
    [startedDate] DATETIME2 NOT NULL,
    [dismissalDate] DATETIME2,
    [workPosition] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Doctor_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [personId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Doctor_pkey] PRIMARY KEY ([id])
);

-- CreateTable
CREATE TABLE [dbo].[StaticChoiceType] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [StaticChoiceType_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [StaticChoiceType_pkey] PRIMARY KEY ([id])
);

-- CreateTable
CREATE TABLE [dbo].[StaticChoice] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [desc] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [StaticChoice_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [staticChoiceTypeId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [StaticChoice_pkey] PRIMARY KEY ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Patient] ADD CONSTRAINT [Patient_personId_fkey] FOREIGN KEY ([personId]) REFERENCES [dbo].[Person]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Patient] ADD CONSTRAINT [Patient_engagementTypeId_fkey] FOREIGN KEY ([engagementTypeId]) REFERENCES [dbo].[StaticChoice]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FamilyMember] ADD CONSTRAINT [FamilyMember_initPatientId_fkey] FOREIGN KEY ([initPatientId]) REFERENCES [dbo].[Patient]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FamilyMember] ADD CONSTRAINT [FamilyMember_targetPatientId_fkey] FOREIGN KEY ([targetPatientId]) REFERENCES [dbo].[Patient]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Doctor] ADD CONSTRAINT [Doctor_personId_fkey] FOREIGN KEY ([personId]) REFERENCES [dbo].[Person]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[StaticChoice] ADD CONSTRAINT [StaticChoice_staticChoiceTypeId_fkey] FOREIGN KEY ([staticChoiceTypeId]) REFERENCES [dbo].[StaticChoiceType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
