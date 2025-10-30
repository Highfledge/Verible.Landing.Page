// To parse this data:
//
//   import { Convert, Register, Login, ResendOTP, VerifyEmail, RequestPasswordReset, ResetPassword, GetCurrentUser, UpdateUser, DeleteAccount, GetMyFeedbackHistory, GetUsersInteractions, ExtractSellerProfileFromURL, ExtractSellerProfileFromURLNotSaved, BecomeSeller, GetMySellerProfile, DeleteSellerAccount, RecalculateMySellerScore, UpdateSeller, GetSellerByNamePublic, GetSellerByIDPublic, GetSellerPulseScorePublic, GetTopSellerByPulseScorePublic, SearchSellersPublic, FlagASeller, EndorseASeller, GetAllSellers, RemoveAFlag, RemoveAnEndorsement, GetSellerFeedbackList, GetSellerAnalytics, AdminLogin, GetCurrentAdmin, GetSystemAnalytics, GetAllUsers, GetAUser, DeleteAUser, UpdateUserStatus, GetASeller, UpdateSellerStatus, VerifySeller, DeleteSeller, GetAllFlags, ReviewFlags, CheckSystemHealth } from "./file";
//
//   const register = Convert.toRegister(json);
//   const login = Convert.toLogin(json);
//   const resendOTP = Convert.toResendOTP(json);
//   const verifyEmail = Convert.toVerifyEmail(json);
//   const requestPasswordReset = Convert.toRequestPasswordReset(json);
//   const resetPassword = Convert.toResetPassword(json);
//   const getCurrentUser = Convert.toGetCurrentUser(json);
//   const updateUser = Convert.toUpdateUser(json);
//   const deleteAccount = Convert.toDeleteAccount(json);
//   const getMyFeedbackHistory = Convert.toGetMyFeedbackHistory(json);
//   const getUsersInteractions = Convert.toGetUsersInteractions(json);
//   const extractSellerProfileFromURL = Convert.toExtractSellerProfileFromURL(json);
//   const extractSellerProfileFromURLNotSaved = Convert.toExtractSellerProfileFromURLNotSaved(json);
//   const becomeSeller = Convert.toBecomeSeller(json);
//   const getMySellerProfile = Convert.toGetMySellerProfile(json);
//   const deleteSellerAccount = Convert.toDeleteSellerAccount(json);
//   const recalculateMySellerScore = Convert.toRecalculateMySellerScore(json);
//   const updateSeller = Convert.toUpdateSeller(json);
//   const getSellerByNamePublic = Convert.toGetSellerByNamePublic(json);
//   const getSellerByIDPublic = Convert.toGetSellerByIDPublic(json);
//   const getSellerPulseScorePublic = Convert.toGetSellerPulseScorePublic(json);
//   const getTopSellerByPulseScorePublic = Convert.toGetTopSellerByPulseScorePublic(json);
//   const searchSellersPublic = Convert.toSearchSellersPublic(json);
//   const flagASeller = Convert.toFlagASeller(json);
//   const endorseASeller = Convert.toEndorseASeller(json);
//   const getAllSellers = Convert.toGetAllSellers(json);
//   const removeAFlag = Convert.toRemoveAFlag(json);
//   const removeAnEndorsement = Convert.toRemoveAnEndorsement(json);
//   const getSellerFeedbackList = Convert.toGetSellerFeedbackList(json);
//   const getSellerAnalytics = Convert.toGetSellerAnalytics(json);
//   const adminLogin = Convert.toAdminLogin(json);
//   const getCurrentAdmin = Convert.toGetCurrentAdmin(json);
//   const getSystemAnalytics = Convert.toGetSystemAnalytics(json);
//   const getAllUsers = Convert.toGetAllUsers(json);
//   const getAUser = Convert.toGetAUser(json);
//   const deleteAUser = Convert.toDeleteAUser(json);
//   const updateUserStatus = Convert.toUpdateUserStatus(json);
//   const getASeller = Convert.toGetASeller(json);
//   const updateSellerStatus = Convert.toUpdateSellerStatus(json);
//   const verifySeller = Convert.toVerifySeller(json);
//   const deleteSeller = Convert.toDeleteSeller(json);
//   const getAllFlags = Convert.toGetAllFlags(json);
//   const reviewFlags = Convert.toReviewFlags(json);
//   const checkSystemHealth = Convert.toCheckSystemHealth(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * Register
 *
 * POST http://localhost:5001/api/auth/register
 */
export interface Register {
    success: boolean;
    message: string;
    data:    RegisterData;
}

export interface RegisterData {
    user:               User;
    token:              string;
    verificationSent:   boolean;
    verificationMethod: VerificationMethod;
}

export interface User {
    name:               string;
    email:              string;
    phone:              string;
    role:               Role;
    verified:           boolean;
    verificationMethod: VerificationMethod | null;
    _id:                string;
    createdAt:          Date;
    updatedAt:          Date;
    isActive?:          boolean;
}

export enum Role {
    Admin = "admin",
    Seller = "seller",
    User = "user",
}

export enum VerificationMethod {
    Email = "email",
}

/**
 * Login
 *
 * POST http://localhost:5001/api/auth/login
 */
export interface Login {
    success: boolean;
    message: string;
    data:    LoginData;
}

export interface LoginData {
    user:  User;
    token: string;
}

/**
 * Resend OTP
 *
 * POST http://localhost:5001/api/auth/verify/resend
 */
export interface ResendOTP {
    success: boolean;
    message: string;
}

/**
 * Verify Email
 *
 * POST http://localhost:5001/api/auth/verify
 */
export interface VerifyEmail {
    success: boolean;
    message: string;
    data:    LoginData;
}

/**
 * Request Password Reset
 *
 * POST http://localhost:5001/api/auth/password/forgot
 */
export interface RequestPasswordReset {
    success: boolean;
    message: string;
}

/**
 * Reset Password
 *
 * POST http://localhost:5001/api/auth/password/reset
 */
export interface ResetPassword {
    success: boolean;
    message: string;
}

/**
 * Get current user
 *
 * GET localhost:5001/api/auth/me
 */
export interface GetCurrentUser {
    success: boolean;
    data:    GetCurrentUserData;
}

export interface GetCurrentUserData {
    user: User;
}

/**
 * Update User
 *
 * PUT localhost:5001/api/users/profile
 */
export interface UpdateUser {
    success: boolean;
    message: string;
    data:    GetCurrentUserData;
}

/**
 * Delete Account
 *
 * DELETE localhost:5001/api/users/account
 */
export interface DeleteAccount {
    success: boolean;
    message: string;
}

/**
 * Get my feedback history
 *
 * GET localhost:5001/api/users/my-feedback
 */
export interface GetMyFeedbackHistory {
    success: boolean;
    data:    GetMyFeedbackHistoryData;
}

export interface GetMyFeedbackHistoryData {
    feedbackHistory:   any[];
    totalInteractions: number;
}

/**
 * Get Users Interactions
 *
 * GET localhost:5001/api/users/my-interactions
 */
export interface GetUsersInteractions {
    success: boolean;
    data:    GetUsersInteractionsData;
}

export interface GetUsersInteractionsData {
    interactions: Interactions;
    summary:      Summary;
}

export interface Interactions {
    flagged:  any[];
    endorsed: any[];
}

export interface Summary {
    totalFlags:        number;
    totalEndorsements: number;
    totalInteractions: number;
}

/**
 * Extract Seller Profile From Url
 *
 * POST localhost:5001/api/sellers/extract-profile
 */
export interface ExtractSellerProfileFromURL {
    success: boolean;
    message: string;
    data:    ExtractSellerProfileFromURLData;
}

export interface ExtractSellerProfileFromURLData {
    seller:        PurpleSeller;
    extractedData: ExtractedData;
    scoringResult: ScoringResult;
}

export interface ExtractedData {
    platform:        Platform;
    profileUrl:      string;
    profileData:     ProfileData;
    marketplaceData: MarketplaceData;
    recentListings:  any[];
    trustIndicators: ExtractedDataTrustIndicators;
}

export interface MarketplaceData {
    accountAge:         number;
    totalListings:      number;
    avgRating:          number;
    totalReviews:       number;
    responseRate:       number;
    verificationStatus: VerificationStatus;
    lastSeen:           string;
    followers:          number;
    categories:         Category[];
}

export interface Category {
    name:  string;
    count: number;
}

export enum VerificationStatus {
    IDVerified = "id-verified",
    Unverified = "unverified",
}

export enum Platform {
    Jiji = "jiji",
}

export interface ProfileData {
    name:            Name;
    profilePicture?: string;
    location:        Location;
    bio:             string;
}

export enum Location {
    LagosNigeria = "Lagos, Nigeria",
    NotSpecified = "Not specified",
}

export enum Name {
    AbdulsalamSodeeq = "Abdulsalam Sodeeq",
    GadgetWorld = "GADGET-WORLD",
    JohnDoe = "John Doe",
    TestSellerForFlagging1 = "Test Seller for Flagging 1",
}

export interface ExtractedDataTrustIndicators {
    hasProfilePicture:  boolean;
    hasLocation:        boolean;
    hasBio:             boolean;
    accountAge:         number;
    totalReviews:       number;
    avgRating:          number;
    verificationStatus: VerificationStatus;
    followers:          number;
    lastSeen:           string;
}

export interface ScoringResult {
    pulseScore:      number;
    confidenceLevel: ConfidenceLevel;
    recommendations: Recommendation[];
    trustIndicators: ScoringResultTrustIndicators;
    riskFactors:     string[];
}

export enum ConfidenceLevel {
    High = "high",
}

export interface Recommendation {
    type:    string;
    message: string;
    action:  string;
}

export interface ScoringResultTrustIndicators {
    accountVerification:  string;
    transactionHistory:   string;
    communicationQuality: string;
    disputeResolution:    string;
}

export interface PurpleSeller {
    profileData:        ProfileData;
    scoringFactors?:    ScoringFactors;
    _id:                ID;
    sellerId:           SellerID;
    platform:           Platform;
    profileUrl:         string;
    pulseScore:         number;
    confidenceLevel:    ConfidenceLevel;
    lastScored:         Date;
    verificationStatus: VerificationStatus;
    listingHistory:     any[];
    isActive?:          boolean;
    isClaimed:          boolean;
    flags?:             any[];
    endorsements?:      any[];
    firstSeen:          Date;
    lastSeen:           Date;
    createdAt:          Date;
    updatedAt:          Date;
    userId?:            UserIDUserID | null | string;
    claimedAt?:         Date;
}

export enum ID {
    The68F3Cc48Cecb60E89241F78A = "68f3cc48cecb60e89241f78a",
    The68F3D5F08C314879D32Bb56E = "68f3d5f08c314879d32bb56e",
}

export interface ScoringFactors {
    urgencyScore:        number;
    profileCompleteness: number;
    priceAnomaly?:       number;
    listingActivity?:    number;
    userFeedback?:       number;
}

export enum SellerID {
    Extracted1760808008440 = "extracted-1760808008440",
    User68F01A554Ef9B19Af107Aaa71760810480544 = "user-68f01a554ef9b19af107aaa7-1760810480544",
}

export interface UserIDUserID {
    _id:       string;
    name:      Name;
    email:     string;
    phone?:    string;
    role?:     Role;
    verified?: boolean;
}

/**
 * Extract Seller Profile From Url - Not Saved
 *
 * POST localhost:5001/api/sellers/score-by-url
 */
export interface ExtractSellerProfileFromURLNotSaved {
    success: boolean;
    message: string;
    data:    ExtractSellerProfileFromURLData;
}

/**
 * Become Seller
 *
 * POST localhost:5001/api/sellers/become-seller
 */
export interface BecomeSeller {
    success: boolean;
    message: string;
    data:    BecomeSellerData;
}

export interface BecomeSellerData {
    seller:        FluffySeller;
    user:          User;
    extractedData: ExtractedData;
    scoringResult: ScoringResult;
}

export interface FluffySeller {
    userId:             UserIDUserID | null;
    sellerId:           string;
    platform:           Platform;
    profileUrl:         string;
    profileData:        ProfileData;
    pulseScore:         number;
    confidenceLevel:    string;
    lastScored:         Date;
    verificationStatus: VerificationStatus;
    listingHistory:     any[];
    scoringFactors?:    ScoringFactors;
    isActive:           boolean;
    isClaimed:          boolean;
    claimedAt?:         Date;
    _id:                string;
    flags?:             any[];
    endorsements?:      any[];
    firstSeen:          Date;
    lastSeen:           Date;
    createdAt:          Date;
    updatedAt:          Date;
}

/**
 * Get My Seller Profile
 *
 * GET localhost:5001/api/sellers/my-profile
 */
export interface GetMySellerProfile {
    success: boolean;
    data:    GetMySellerProfileData;
}

export interface GetMySellerProfileData {
    seller: PurpleSeller;
}

/**
 * Delete Seller Account
 *
 * DELETE localhost:5001/api/sellers/account
 */
export interface DeleteSellerAccount {
    success: boolean;
    message: string;
}

/**
 * Recalculate My Seller Score
 *
 * POST localhost:5001/api/sellers/68f3d5f08c314879d32bb56e/recalculate-score
 */
export interface RecalculateMySellerScore {
    success: boolean;
    message: string;
    data:    RecalculateMySellerScoreData;
}

export interface RecalculateMySellerScoreData {
    seller:        PurpleSeller;
    scoringResult: ScoringResult;
}

/**
 * Update Seller
 *
 * PUT localhost:5001/api/sellers/profile
 */
export interface UpdateSeller {
    success: boolean;
    message: string;
    data:    UpdateSellerData;
}

export interface UpdateSellerData {
    seller: TentacledSeller;
}

export interface TentacledSeller {
    profileData:        ProfileData;
    scoringFactors?:    ScoringFactors;
    _id:                ID;
    userId:             null | string;
    sellerId:           SellerID;
    platform:           Platform;
    profileUrl:         string;
    pulseScore:         number;
    confidenceLevel:    ConfidenceLevel;
    lastScored:         Date;
    verificationStatus: VerificationStatus;
    listingHistory:     any[];
    isActive:           boolean;
    isClaimed:          boolean;
    claimedAt:          Date;
    flags?:             any[];
    endorsements?:      any[];
    firstSeen:          Date;
    lastSeen:           Date;
    createdAt:          Date;
    updatedAt:          Date;
    verifiedAt?:        Date;
}

/**
 * Get seller by name - Public
 *
 * GET localhost:5001/api/sellers/lookup?name=Doe&platform=jiji
 */
export interface GetSellerByNamePublic {
    success: boolean;
    data:    GetMySellerProfileData;
}

/**
 * Get seller by Id - Public
 *
 * GET localhost:5001/api/sellers/68f3d5f08c314879d32bb56e
 */
export interface GetSellerByIDPublic {
    success: boolean;
    data:    GetMySellerProfileData;
}

/**
 * Get seller pulse score - Public
 *
 * GET localhost:5001/api/sellers/68f3d5f08c314879d32bb56e/score
 */
export interface GetSellerPulseScorePublic {
    success: boolean;
    data:    GetSellerPulseScorePublicData;
}

export interface GetSellerPulseScorePublicData {
    score: Score;
}

export interface Score {
    pulseScore:         number;
    confidenceLevel:    ConfidenceLevel;
    lastScored:         Date;
    verificationStatus: VerificationStatus;
    totalFlags:         number;
    totalEndorsements:  number;
    netFeedbackScore:   number;
}

/**
 * Get Top Seller - By Pulse Score (Public)
 *
 * GET localhost:5001/api/sellers/top
 */
export interface GetTopSellerByPulseScorePublic {
    success: boolean;
    data:    GetTopSellerByPulseScorePublicData;
}

export interface GetTopSellerByPulseScorePublicData {
    sellers: PurpleSeller[];
    count:   number;
}

/**
 * Search Sellers - Public
 *
 * GET localhost:5001/api/sellers/search?platform=jiji&name=Doe&location=Lagos
 */
export interface SearchSellersPublic {
    success: boolean;
    data:    SearchSellersPublicData;
}

export interface SearchSellersPublicData {
    sellers:    PurpleSeller[];
    pagination: PurplePagination;
}

export interface PurplePagination {
    currentPage:  number;
    totalPages:   number;
    totalSellers: number;
    hasNext:      boolean;
    hasPrev:      boolean;
}

/**
 * Flag A Seller
 *
 * POST localhost:5001/api/sellers/68fb8d9ad8299bdd94be605d/flag
 */
export interface FlagASeller {
    success: boolean;
    message: string;
}

/**
 * Endorse a seller
 *
 * POST localhost:5001/api/sellers/68fb8d9ad8299bdd94be605d/flag
 */
export interface EndorseASeller {
    success: boolean;
    message: string;
}

/**
 * Get All Sellers
 *
 * GET localhost:5001/api/admin/sellers
 */
export interface GetAllSellers {
    success: boolean;
    data:    GetAllSellersData;
}

export interface GetAllSellersData {
    sellers:     FluffySeller[];
    count?:      number;
    total?:      number;
    stats?:      Stats;
    query?:      Query;
    limit?:      number;
    pagination?: FluffyPagination;
}

export interface FluffyPagination {
    currentPage:  number;
    totalPages:   number;
    totalItems:   number;
    itemsPerPage: number;
}

export interface Query {
    isActive: boolean;
}

export interface Stats {
    active:    number;
    inactive:  number;
    claimed:   number;
    extracted: number;
}

/**
 * Remove a flag
 *
 * DELETE localhost:5001/api/sellers/68fb8d9ad8299bdd94be605d/flag
 */
export interface RemoveAFlag {
    success: boolean;
    message: string;
    data:    RemoveAFlagData;
}

export interface RemoveAFlagData {
    newPulseScore:      number;
    newConfidenceLevel: ConfidenceLevel;
    totalFlags:         number;
    netFeedbackScore:   number;
}

/**
 * Remove an endorsement
 *
 * DELETE localhost:5001/api/sellers/68fb8d9ad8299bdd94be605d/endorse
 */
export interface RemoveAnEndorsement {
    success: boolean;
    message: string;
    data:    RemoveAFlagData;
}

/**
 * Get seller feedback list
 *
 * GET localhost:5001/api/sellers/68fb8d9ad8299bdd94be605d/feedback
 */
export interface GetSellerFeedbackList {
    success: boolean;
    data:    GetSellerFeedbackListData;
}

export interface GetSellerFeedbackListData {
    flags:             any[];
    endorsements:      any[];
    totalFlags:        number;
    totalEndorsements: number;
    netFeedbackScore:  number;
}

/**
 * Get Seller Analytics
 *
 * GET localhost:5001/api/sellers/68fb8d9ad8299bdd94be605d/analytics
 */
export interface GetSellerAnalytics {
    success: boolean;
    data:    GetSellerAnalyticsData;
}

export interface GetSellerAnalyticsData {
    seller:     StickySeller;
    feedback:   Feedback;
    listings:   Listings;
    trustLevel: string;
}

export interface Feedback {
    totalFlags:        number;
    totalEndorsements: number;
    netFeedbackScore:  number;
}

export interface Listings {
    total:        number;
    active:       number;
    inactive:     number;
    averagePrice: number;
}

export interface StickySeller {
    id:                 string;
    pulseScore:         number;
    confidenceLevel:    ConfidenceLevel;
    verificationStatus: VerificationStatus;
    lastScored:         Date;
}

/**
 * Admin Login
 *
 * POST localhost:5001/api/admin/login
 */
export interface AdminLogin {
    success: boolean;
    message: string;
    data:    AdminLoginData;
}

export interface AdminLoginData {
    admin: User;
    token: string;
}

/**
 * Get Current Admin
 *
 * GET localhost:5001/api/admin/me
 */
export interface GetCurrentAdmin {
    success: boolean;
    data:    GetCurrentAdminData;
}

export interface GetCurrentAdminData {
    admin: User;
}

/**
 * Get System Analytics
 *
 * GET localhost:5001/api/admin/analytics/overview
 */
export interface GetSystemAnalytics {
    success: boolean;
    data:    GetSystemAnalyticsData;
}

export interface GetSystemAnalyticsData {
    overview:                 Overview;
    recentActivity:           RecentActivity;
    platformDistribution:     Distribution[];
    verificationDistribution: Distribution[];
}

export interface Overview {
    totalUsers:      number;
    totalSellers:    number;
    totalListings:   number;
    verifiedUsers:   number;
    verifiedSellers: number;
    activeListings:  number;
    flaggedSellers:  number;
    flaggedListings: number;
}

export interface Distribution {
    _id:   string;
    count: number;
}

export interface RecentActivity {
    users:    number;
    sellers:  number;
    listings: number;
}

/**
 * Get All Users
 *
 * GET localhost:5001/api/admin/users
 */
export interface GetAllUsers {
    success: boolean;
    data:    GetAllUsersData;
}

export interface GetAllUsersData {
    users:      User[];
    pagination: FluffyPagination;
}

/**
 * Get a user
 *
 * GET localhost:5001/api/admin/users/68f01a554ef9b19af107aaa7
 */
export interface GetAUser {
    success: boolean;
    data:    GetAUserData;
}

export interface GetAUserData {
    user:    User;
    sellers: TentacledSeller[];
}

/**
 * Delete a User
 *
 * DELETE localhost:5001/api/admin/users/68f367b4b682a136902eab79
 */
export interface DeleteAUser {
    success: boolean;
    message: string;
}

/**
 * Update User Status
 *
 * PUT localhost:5001/api/admin/users/68f01a554ef9b19af107aaa7/status
 */
export interface UpdateUserStatus {
    success: boolean;
    message: string;
    data:    GetCurrentUserData;
}

/**
 * Get A Seller
 *
 * GET localhost:5001/api/admin/sellers/68f3cc48cecb60e89241f78a
 */
export interface GetASeller {
    success: boolean;
    data:    GetASellerData;
}

export interface GetASellerData {
    seller:         FluffySeller;
    recentListings: any[];
}

/**
 * Update Seller Status
 *
 * PUT localhost:5001/api/admin/sellers/68f3cc48cecb60e89241f78a/status
 */
export interface UpdateSellerStatus {
    success: boolean;
    message: string;
    data:    GetMySellerProfileData;
}

/**
 * Verify Seller
 *
 * POST localhost:5001/api/admin/sellers/68f3cc48cecb60e89241f78a/verify
 */
export interface VerifySeller {
    success: boolean;
    message: string;
    data:    UpdateSellerData;
}

/**
 * Delete Seller
 *
 * DELETE localhost:5001/api/admin/sellers/68f3cc48cecb60e89241f78a
 */
export interface DeleteSeller {
    success: boolean;
    message: string;
}

/**
 * Get All Flags
 *
 * GET localhost:5001/api/admin/flags
 */
export interface GetAllFlags {
    success: boolean;
    data:    GetAllFlagsData;
}

export interface GetAllFlagsData {
    flags:      PurpleFlag[];
    pagination: FluffyPagination;
}

export interface PurpleFlag {
    profileData:        ProfileData;
    scoringFactors:     ScoringFactors;
    _id:                string;
    userId:             null;
    sellerId:           string;
    platform:           Platform;
    profileUrl:         string;
    pulseScore:         number;
    confidenceLevel:    ConfidenceLevel;
    lastScored:         Date;
    verificationStatus: VerificationStatus;
    listingHistory:     any[];
    isActive:           boolean;
    isClaimed:          boolean;
    flags:              FlagFlag[];
    endorsements:       any[];
    firstSeen:          Date;
    lastSeen:           Date;
    createdAt:          Date;
    updatedAt:          Date;
}

export interface FlagFlag {
    adminReview: AdminReview;
    userId:      FlagUserID;
    reason:      string;
    timestamp:   Date;
    isVerified:  boolean;
    _id:         string;
}

export interface AdminReview {
    reviewedBy:  string;
    reviewedAt:  Date;
    action:      string;
    adminNotes?: string;
}

export interface FlagUserID {
    _id:   string;
    name:  string;
    email: string;
}

/**
 * Review Flags
 *
 * PUT localhost:5001/api/admin/flags/68fb8d9ad8299bdd94be605d/review
 */
export interface ReviewFlags {
    success: boolean;
    message: string;
    data:    ReviewFlagsData;
}

export interface ReviewFlagsData {
    flag: FluffyFlag;
}

export interface FluffyFlag {
    adminReview: AdminReview;
    userId:      string;
    reason:      string;
    timestamp:   Date;
    isVerified:  boolean;
    _id:         string;
}

/**
 * Check system health
 *
 * GET localhost:5001/api/admin/system/health
 */
export interface CheckSystemHealth {
    success: boolean;
    data:    CheckSystemHealthData;
}

export interface CheckSystemHealthData {
    status:       string;
    timestamp:    Date;
    responseTime: string;
    database:     Database;
    uptime:       number;
}

export interface Database {
    status:       string;
    responseTime: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toRegister(json: string): Register {
        return cast(JSON.parse(json), r("Register"));
    }

    public static registerToJson(value: Register): string {
        return JSON.stringify(uncast(value, r("Register")), null, 2);
    }

    public static toLogin(json: string): Login {
        return cast(JSON.parse(json), r("Login"));
    }

    public static loginToJson(value: Login): string {
        return JSON.stringify(uncast(value, r("Login")), null, 2);
    }

    public static toResendOTP(json: string): ResendOTP {
        return cast(JSON.parse(json), r("ResendOTP"));
    }

    public static resendOTPToJson(value: ResendOTP): string {
        return JSON.stringify(uncast(value, r("ResendOTP")), null, 2);
    }

    public static toVerifyEmail(json: string): VerifyEmail {
        return cast(JSON.parse(json), r("VerifyEmail"));
    }

    public static verifyEmailToJson(value: VerifyEmail): string {
        return JSON.stringify(uncast(value, r("VerifyEmail")), null, 2);
    }

    public static toRequestPasswordReset(json: string): RequestPasswordReset {
        return cast(JSON.parse(json), r("RequestPasswordReset"));
    }

    public static requestPasswordResetToJson(value: RequestPasswordReset): string {
        return JSON.stringify(uncast(value, r("RequestPasswordReset")), null, 2);
    }

    public static toResetPassword(json: string): ResetPassword {
        return cast(JSON.parse(json), r("ResetPassword"));
    }

    public static resetPasswordToJson(value: ResetPassword): string {
        return JSON.stringify(uncast(value, r("ResetPassword")), null, 2);
    }

    public static toGetCurrentUser(json: string): GetCurrentUser {
        return cast(JSON.parse(json), r("GetCurrentUser"));
    }

    public static getCurrentUserToJson(value: GetCurrentUser): string {
        return JSON.stringify(uncast(value, r("GetCurrentUser")), null, 2);
    }

    public static toUpdateUser(json: string): UpdateUser {
        return cast(JSON.parse(json), r("UpdateUser"));
    }

    public static updateUserToJson(value: UpdateUser): string {
        return JSON.stringify(uncast(value, r("UpdateUser")), null, 2);
    }

    public static toDeleteAccount(json: string): DeleteAccount {
        return cast(JSON.parse(json), r("DeleteAccount"));
    }

    public static deleteAccountToJson(value: DeleteAccount): string {
        return JSON.stringify(uncast(value, r("DeleteAccount")), null, 2);
    }

    public static toGetMyFeedbackHistory(json: string): GetMyFeedbackHistory {
        return cast(JSON.parse(json), r("GetMyFeedbackHistory"));
    }

    public static getMyFeedbackHistoryToJson(value: GetMyFeedbackHistory): string {
        return JSON.stringify(uncast(value, r("GetMyFeedbackHistory")), null, 2);
    }

    public static toGetUsersInteractions(json: string): GetUsersInteractions {
        return cast(JSON.parse(json), r("GetUsersInteractions"));
    }

    public static getUsersInteractionsToJson(value: GetUsersInteractions): string {
        return JSON.stringify(uncast(value, r("GetUsersInteractions")), null, 2);
    }

    public static toExtractSellerProfileFromURL(json: string): ExtractSellerProfileFromURL {
        return cast(JSON.parse(json), r("ExtractSellerProfileFromURL"));
    }

    public static extractSellerProfileFromURLToJson(value: ExtractSellerProfileFromURL): string {
        return JSON.stringify(uncast(value, r("ExtractSellerProfileFromURL")), null, 2);
    }

    public static toExtractSellerProfileFromURLNotSaved(json: string): ExtractSellerProfileFromURLNotSaved {
        return cast(JSON.parse(json), r("ExtractSellerProfileFromURLNotSaved"));
    }

    public static extractSellerProfileFromURLNotSavedToJson(value: ExtractSellerProfileFromURLNotSaved): string {
        return JSON.stringify(uncast(value, r("ExtractSellerProfileFromURLNotSaved")), null, 2);
    }

    public static toBecomeSeller(json: string): BecomeSeller {
        return cast(JSON.parse(json), r("BecomeSeller"));
    }

    public static becomeSellerToJson(value: BecomeSeller): string {
        return JSON.stringify(uncast(value, r("BecomeSeller")), null, 2);
    }

    public static toGetMySellerProfile(json: string): GetMySellerProfile {
        return cast(JSON.parse(json), r("GetMySellerProfile"));
    }

    public static getMySellerProfileToJson(value: GetMySellerProfile): string {
        return JSON.stringify(uncast(value, r("GetMySellerProfile")), null, 2);
    }

    public static toDeleteSellerAccount(json: string): DeleteSellerAccount {
        return cast(JSON.parse(json), r("DeleteSellerAccount"));
    }

    public static deleteSellerAccountToJson(value: DeleteSellerAccount): string {
        return JSON.stringify(uncast(value, r("DeleteSellerAccount")), null, 2);
    }

    public static toRecalculateMySellerScore(json: string): RecalculateMySellerScore {
        return cast(JSON.parse(json), r("RecalculateMySellerScore"));
    }

    public static recalculateMySellerScoreToJson(value: RecalculateMySellerScore): string {
        return JSON.stringify(uncast(value, r("RecalculateMySellerScore")), null, 2);
    }

    public static toUpdateSeller(json: string): UpdateSeller {
        return cast(JSON.parse(json), r("UpdateSeller"));
    }

    public static updateSellerToJson(value: UpdateSeller): string {
        return JSON.stringify(uncast(value, r("UpdateSeller")), null, 2);
    }

    public static toGetSellerByNamePublic(json: string): GetSellerByNamePublic {
        return cast(JSON.parse(json), r("GetSellerByNamePublic"));
    }

    public static getSellerByNamePublicToJson(value: GetSellerByNamePublic): string {
        return JSON.stringify(uncast(value, r("GetSellerByNamePublic")), null, 2);
    }

    public static toGetSellerByIDPublic(json: string): GetSellerByIDPublic {
        return cast(JSON.parse(json), r("GetSellerByIDPublic"));
    }

    public static getSellerByIDPublicToJson(value: GetSellerByIDPublic): string {
        return JSON.stringify(uncast(value, r("GetSellerByIDPublic")), null, 2);
    }

    public static toGetSellerPulseScorePublic(json: string): GetSellerPulseScorePublic {
        return cast(JSON.parse(json), r("GetSellerPulseScorePublic"));
    }

    public static getSellerPulseScorePublicToJson(value: GetSellerPulseScorePublic): string {
        return JSON.stringify(uncast(value, r("GetSellerPulseScorePublic")), null, 2);
    }

    public static toGetTopSellerByPulseScorePublic(json: string): GetTopSellerByPulseScorePublic {
        return cast(JSON.parse(json), r("GetTopSellerByPulseScorePublic"));
    }

    public static getTopSellerByPulseScorePublicToJson(value: GetTopSellerByPulseScorePublic): string {
        return JSON.stringify(uncast(value, r("GetTopSellerByPulseScorePublic")), null, 2);
    }

    public static toSearchSellersPublic(json: string): SearchSellersPublic {
        return cast(JSON.parse(json), r("SearchSellersPublic"));
    }

    public static searchSellersPublicToJson(value: SearchSellersPublic): string {
        return JSON.stringify(uncast(value, r("SearchSellersPublic")), null, 2);
    }

    public static toFlagASeller(json: string): FlagASeller {
        return cast(JSON.parse(json), r("FlagASeller"));
    }

    public static flagASellerToJson(value: FlagASeller): string {
        return JSON.stringify(uncast(value, r("FlagASeller")), null, 2);
    }

    public static toEndorseASeller(json: string): EndorseASeller {
        return cast(JSON.parse(json), r("EndorseASeller"));
    }

    public static endorseASellerToJson(value: EndorseASeller): string {
        return JSON.stringify(uncast(value, r("EndorseASeller")), null, 2);
    }

    public static toGetAllSellers(json: string): GetAllSellers {
        return cast(JSON.parse(json), r("GetAllSellers"));
    }

    public static getAllSellersToJson(value: GetAllSellers): string {
        return JSON.stringify(uncast(value, r("GetAllSellers")), null, 2);
    }

    public static toRemoveAFlag(json: string): RemoveAFlag {
        return cast(JSON.parse(json), r("RemoveAFlag"));
    }

    public static removeAFlagToJson(value: RemoveAFlag): string {
        return JSON.stringify(uncast(value, r("RemoveAFlag")), null, 2);
    }

    public static toRemoveAnEndorsement(json: string): RemoveAnEndorsement {
        return cast(JSON.parse(json), r("RemoveAnEndorsement"));
    }

    public static removeAnEndorsementToJson(value: RemoveAnEndorsement): string {
        return JSON.stringify(uncast(value, r("RemoveAnEndorsement")), null, 2);
    }

    public static toGetSellerFeedbackList(json: string): GetSellerFeedbackList {
        return cast(JSON.parse(json), r("GetSellerFeedbackList"));
    }

    public static getSellerFeedbackListToJson(value: GetSellerFeedbackList): string {
        return JSON.stringify(uncast(value, r("GetSellerFeedbackList")), null, 2);
    }

    public static toGetSellerAnalytics(json: string): GetSellerAnalytics {
        return cast(JSON.parse(json), r("GetSellerAnalytics"));
    }

    public static getSellerAnalyticsToJson(value: GetSellerAnalytics): string {
        return JSON.stringify(uncast(value, r("GetSellerAnalytics")), null, 2);
    }

    public static toAdminLogin(json: string): AdminLogin {
        return cast(JSON.parse(json), r("AdminLogin"));
    }

    public static adminLoginToJson(value: AdminLogin): string {
        return JSON.stringify(uncast(value, r("AdminLogin")), null, 2);
    }

    public static toGetCurrentAdmin(json: string): GetCurrentAdmin {
        return cast(JSON.parse(json), r("GetCurrentAdmin"));
    }

    public static getCurrentAdminToJson(value: GetCurrentAdmin): string {
        return JSON.stringify(uncast(value, r("GetCurrentAdmin")), null, 2);
    }

    public static toGetSystemAnalytics(json: string): GetSystemAnalytics {
        return cast(JSON.parse(json), r("GetSystemAnalytics"));
    }

    public static getSystemAnalyticsToJson(value: GetSystemAnalytics): string {
        return JSON.stringify(uncast(value, r("GetSystemAnalytics")), null, 2);
    }

    public static toGetAllUsers(json: string): GetAllUsers {
        return cast(JSON.parse(json), r("GetAllUsers"));
    }

    public static getAllUsersToJson(value: GetAllUsers): string {
        return JSON.stringify(uncast(value, r("GetAllUsers")), null, 2);
    }

    public static toGetAUser(json: string): GetAUser {
        return cast(JSON.parse(json), r("GetAUser"));
    }

    public static getAUserToJson(value: GetAUser): string {
        return JSON.stringify(uncast(value, r("GetAUser")), null, 2);
    }

    public static toDeleteAUser(json: string): DeleteAUser {
        return cast(JSON.parse(json), r("DeleteAUser"));
    }

    public static deleteAUserToJson(value: DeleteAUser): string {
        return JSON.stringify(uncast(value, r("DeleteAUser")), null, 2);
    }

    public static toUpdateUserStatus(json: string): UpdateUserStatus {
        return cast(JSON.parse(json), r("UpdateUserStatus"));
    }

    public static updateUserStatusToJson(value: UpdateUserStatus): string {
        return JSON.stringify(uncast(value, r("UpdateUserStatus")), null, 2);
    }

    public static toGetASeller(json: string): GetASeller {
        return cast(JSON.parse(json), r("GetASeller"));
    }

    public static getASellerToJson(value: GetASeller): string {
        return JSON.stringify(uncast(value, r("GetASeller")), null, 2);
    }

    public static toUpdateSellerStatus(json: string): UpdateSellerStatus {
        return cast(JSON.parse(json), r("UpdateSellerStatus"));
    }

    public static updateSellerStatusToJson(value: UpdateSellerStatus): string {
        return JSON.stringify(uncast(value, r("UpdateSellerStatus")), null, 2);
    }

    public static toVerifySeller(json: string): VerifySeller {
        return cast(JSON.parse(json), r("VerifySeller"));
    }

    public static verifySellerToJson(value: VerifySeller): string {
        return JSON.stringify(uncast(value, r("VerifySeller")), null, 2);
    }

    public static toDeleteSeller(json: string): DeleteSeller {
        return cast(JSON.parse(json), r("DeleteSeller"));
    }

    public static deleteSellerToJson(value: DeleteSeller): string {
        return JSON.stringify(uncast(value, r("DeleteSeller")), null, 2);
    }

    public static toGetAllFlags(json: string): GetAllFlags {
        return cast(JSON.parse(json), r("GetAllFlags"));
    }

    public static getAllFlagsToJson(value: GetAllFlags): string {
        return JSON.stringify(uncast(value, r("GetAllFlags")), null, 2);
    }

    public static toReviewFlags(json: string): ReviewFlags {
        return cast(JSON.parse(json), r("ReviewFlags"));
    }

    public static reviewFlagsToJson(value: ReviewFlags): string {
        return JSON.stringify(uncast(value, r("ReviewFlags")), null, 2);
    }

    public static toCheckSystemHealth(json: string): CheckSystemHealth {
        return cast(JSON.parse(json), r("CheckSystemHealth"));
    }

    public static checkSystemHealthToJson(value: CheckSystemHealth): string {
        return JSON.stringify(uncast(value, r("CheckSystemHealth")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Register": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("RegisterData") },
    ], false),
    "RegisterData": o([
        { json: "user", js: "user", typ: r("User") },
        { json: "token", js: "token", typ: "" },
        { json: "verificationSent", js: "verificationSent", typ: true },
        { json: "verificationMethod", js: "verificationMethod", typ: r("VerificationMethod") },
    ], false),
    "User": o([
        { json: "name", js: "name", typ: "" },
        { json: "email", js: "email", typ: "" },
        { json: "phone", js: "phone", typ: "" },
        { json: "role", js: "role", typ: r("Role") },
        { json: "verified", js: "verified", typ: true },
        { json: "verificationMethod", js: "verificationMethod", typ: u(r("VerificationMethod"), null) },
        { json: "_id", js: "_id", typ: "" },
        { json: "createdAt", js: "createdAt", typ: Date },
        { json: "updatedAt", js: "updatedAt", typ: Date },
        { json: "isActive", js: "isActive", typ: u(undefined, true) },
    ], false),
    "Login": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("LoginData") },
    ], false),
    "LoginData": o([
        { json: "user", js: "user", typ: r("User") },
        { json: "token", js: "token", typ: "" },
    ], false),
    "ResendOTP": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
    ], false),
    "VerifyEmail": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("LoginData") },
    ], false),
    "RequestPasswordReset": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
    ], false),
    "ResetPassword": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
    ], false),
    "GetCurrentUser": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetCurrentUserData") },
    ], false),
    "GetCurrentUserData": o([
        { json: "user", js: "user", typ: r("User") },
    ], false),
    "UpdateUser": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("GetCurrentUserData") },
    ], false),
    "DeleteAccount": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
    ], false),
    "GetMyFeedbackHistory": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetMyFeedbackHistoryData") },
    ], false),
    "GetMyFeedbackHistoryData": o([
        { json: "feedbackHistory", js: "feedbackHistory", typ: a("any") },
        { json: "totalInteractions", js: "totalInteractions", typ: 0 },
    ], false),
    "GetUsersInteractions": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetUsersInteractionsData") },
    ], false),
    "GetUsersInteractionsData": o([
        { json: "interactions", js: "interactions", typ: r("Interactions") },
        { json: "summary", js: "summary", typ: r("Summary") },
    ], false),
    "Interactions": o([
        { json: "flagged", js: "flagged", typ: a("any") },
        { json: "endorsed", js: "endorsed", typ: a("any") },
    ], false),
    "Summary": o([
        { json: "totalFlags", js: "totalFlags", typ: 0 },
        { json: "totalEndorsements", js: "totalEndorsements", typ: 0 },
        { json: "totalInteractions", js: "totalInteractions", typ: 0 },
    ], false),
    "ExtractSellerProfileFromURL": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("ExtractSellerProfileFromURLData") },
    ], false),
    "ExtractSellerProfileFromURLData": o([
        { json: "seller", js: "seller", typ: r("PurpleSeller") },
        { json: "extractedData", js: "extractedData", typ: r("ExtractedData") },
        { json: "scoringResult", js: "scoringResult", typ: r("ScoringResult") },
    ], false),
    "ExtractedData": o([
        { json: "platform", js: "platform", typ: r("Platform") },
        { json: "profileUrl", js: "profileUrl", typ: "" },
        { json: "profileData", js: "profileData", typ: r("ProfileData") },
        { json: "marketplaceData", js: "marketplaceData", typ: r("MarketplaceData") },
        { json: "recentListings", js: "recentListings", typ: a("any") },
        { json: "trustIndicators", js: "trustIndicators", typ: r("ExtractedDataTrustIndicators") },
    ], false),
    "MarketplaceData": o([
        { json: "accountAge", js: "accountAge", typ: 0 },
        { json: "totalListings", js: "totalListings", typ: 0 },
        { json: "avgRating", js: "avgRating", typ: 0 },
        { json: "totalReviews", js: "totalReviews", typ: 0 },
        { json: "responseRate", js: "responseRate", typ: 0 },
        { json: "verificationStatus", js: "verificationStatus", typ: r("VerificationStatus") },
        { json: "lastSeen", js: "lastSeen", typ: "" },
        { json: "followers", js: "followers", typ: 0 },
        { json: "categories", js: "categories", typ: a(r("Category")) },
    ], false),
    "Category": o([
        { json: "name", js: "name", typ: "" },
        { json: "count", js: "count", typ: 0 },
    ], false),
    "ProfileData": o([
        { json: "name", js: "name", typ: r("Name") },
        { json: "profilePicture", js: "profilePicture", typ: u(undefined, "") },
        { json: "location", js: "location", typ: r("Location") },
        { json: "bio", js: "bio", typ: "" },
    ], false),
    "ExtractedDataTrustIndicators": o([
        { json: "hasProfilePicture", js: "hasProfilePicture", typ: true },
        { json: "hasLocation", js: "hasLocation", typ: true },
        { json: "hasBio", js: "hasBio", typ: true },
        { json: "accountAge", js: "accountAge", typ: 0 },
        { json: "totalReviews", js: "totalReviews", typ: 0 },
        { json: "avgRating", js: "avgRating", typ: 0 },
        { json: "verificationStatus", js: "verificationStatus", typ: r("VerificationStatus") },
        { json: "followers", js: "followers", typ: 0 },
        { json: "lastSeen", js: "lastSeen", typ: "" },
    ], false),
    "ScoringResult": o([
        { json: "pulseScore", js: "pulseScore", typ: 0 },
        { json: "confidenceLevel", js: "confidenceLevel", typ: r("ConfidenceLevel") },
        { json: "recommendations", js: "recommendations", typ: a(r("Recommendation")) },
        { json: "trustIndicators", js: "trustIndicators", typ: r("ScoringResultTrustIndicators") },
        { json: "riskFactors", js: "riskFactors", typ: a("") },
    ], false),
    "Recommendation": o([
        { json: "type", js: "type", typ: "" },
        { json: "message", js: "message", typ: "" },
        { json: "action", js: "action", typ: "" },
    ], false),
    "ScoringResultTrustIndicators": o([
        { json: "accountVerification", js: "accountVerification", typ: "" },
        { json: "transactionHistory", js: "transactionHistory", typ: "" },
        { json: "communicationQuality", js: "communicationQuality", typ: "" },
        { json: "disputeResolution", js: "disputeResolution", typ: "" },
    ], false),
    "PurpleSeller": o([
        { json: "profileData", js: "profileData", typ: r("ProfileData") },
        { json: "scoringFactors", js: "scoringFactors", typ: u(undefined, r("ScoringFactors")) },
        { json: "_id", js: "_id", typ: r("ID") },
        { json: "sellerId", js: "sellerId", typ: r("SellerID") },
        { json: "platform", js: "platform", typ: r("Platform") },
        { json: "profileUrl", js: "profileUrl", typ: "" },
        { json: "pulseScore", js: "pulseScore", typ: 0 },
        { json: "confidenceLevel", js: "confidenceLevel", typ: r("ConfidenceLevel") },
        { json: "lastScored", js: "lastScored", typ: Date },
        { json: "verificationStatus", js: "verificationStatus", typ: r("VerificationStatus") },
        { json: "listingHistory", js: "listingHistory", typ: a("any") },
        { json: "isActive", js: "isActive", typ: u(undefined, true) },
        { json: "isClaimed", js: "isClaimed", typ: true },
        { json: "flags", js: "flags", typ: u(undefined, a("any")) },
        { json: "endorsements", js: "endorsements", typ: u(undefined, a("any")) },
        { json: "firstSeen", js: "firstSeen", typ: Date },
        { json: "lastSeen", js: "lastSeen", typ: Date },
        { json: "createdAt", js: "createdAt", typ: Date },
        { json: "updatedAt", js: "updatedAt", typ: Date },
        { json: "userId", js: "userId", typ: u(undefined, u(r("UserIDUserID"), null, "")) },
        { json: "claimedAt", js: "claimedAt", typ: u(undefined, Date) },
    ], false),
    "ScoringFactors": o([
        { json: "urgencyScore", js: "urgencyScore", typ: 0 },
        { json: "profileCompleteness", js: "profileCompleteness", typ: 0 },
        { json: "priceAnomaly", js: "priceAnomaly", typ: u(undefined, 0) },
        { json: "listingActivity", js: "listingActivity", typ: u(undefined, 0) },
        { json: "userFeedback", js: "userFeedback", typ: u(undefined, 0) },
    ], false),
    "UserIDUserID": o([
        { json: "_id", js: "_id", typ: "" },
        { json: "name", js: "name", typ: r("Name") },
        { json: "email", js: "email", typ: "" },
        { json: "phone", js: "phone", typ: u(undefined, "") },
        { json: "role", js: "role", typ: u(undefined, r("Role")) },
        { json: "verified", js: "verified", typ: u(undefined, true) },
    ], false),
    "ExtractSellerProfileFromURLNotSaved": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("ExtractSellerProfileFromURLData") },
    ], false),
    "BecomeSeller": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("BecomeSellerData") },
    ], false),
    "BecomeSellerData": o([
        { json: "seller", js: "seller", typ: r("FluffySeller") },
        { json: "user", js: "user", typ: r("User") },
        { json: "extractedData", js: "extractedData", typ: r("ExtractedData") },
        { json: "scoringResult", js: "scoringResult", typ: r("ScoringResult") },
    ], false),
    "FluffySeller": o([
        { json: "userId", js: "userId", typ: u(r("UserIDUserID"), null) },
        { json: "sellerId", js: "sellerId", typ: "" },
        { json: "platform", js: "platform", typ: r("Platform") },
        { json: "profileUrl", js: "profileUrl", typ: "" },
        { json: "profileData", js: "profileData", typ: r("ProfileData") },
        { json: "pulseScore", js: "pulseScore", typ: 0 },
        { json: "confidenceLevel", js: "confidenceLevel", typ: "" },
        { json: "lastScored", js: "lastScored", typ: Date },
        { json: "verificationStatus", js: "verificationStatus", typ: r("VerificationStatus") },
        { json: "listingHistory", js: "listingHistory", typ: a("any") },
        { json: "scoringFactors", js: "scoringFactors", typ: u(undefined, r("ScoringFactors")) },
        { json: "isActive", js: "isActive", typ: true },
        { json: "isClaimed", js: "isClaimed", typ: true },
        { json: "claimedAt", js: "claimedAt", typ: u(undefined, Date) },
        { json: "_id", js: "_id", typ: "" },
        { json: "flags", js: "flags", typ: u(undefined, a("any")) },
        { json: "endorsements", js: "endorsements", typ: u(undefined, a("any")) },
        { json: "firstSeen", js: "firstSeen", typ: Date },
        { json: "lastSeen", js: "lastSeen", typ: Date },
        { json: "createdAt", js: "createdAt", typ: Date },
        { json: "updatedAt", js: "updatedAt", typ: Date },
    ], false),
    "GetMySellerProfile": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetMySellerProfileData") },
    ], false),
    "GetMySellerProfileData": o([
        { json: "seller", js: "seller", typ: r("PurpleSeller") },
    ], false),
    "DeleteSellerAccount": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
    ], false),
    "RecalculateMySellerScore": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("RecalculateMySellerScoreData") },
    ], false),
    "RecalculateMySellerScoreData": o([
        { json: "seller", js: "seller", typ: r("PurpleSeller") },
        { json: "scoringResult", js: "scoringResult", typ: r("ScoringResult") },
    ], false),
    "UpdateSeller": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("UpdateSellerData") },
    ], false),
    "UpdateSellerData": o([
        { json: "seller", js: "seller", typ: r("TentacledSeller") },
    ], false),
    "TentacledSeller": o([
        { json: "profileData", js: "profileData", typ: r("ProfileData") },
        { json: "scoringFactors", js: "scoringFactors", typ: u(undefined, r("ScoringFactors")) },
        { json: "_id", js: "_id", typ: r("ID") },
        { json: "userId", js: "userId", typ: u(null, "") },
        { json: "sellerId", js: "sellerId", typ: r("SellerID") },
        { json: "platform", js: "platform", typ: r("Platform") },
        { json: "profileUrl", js: "profileUrl", typ: "" },
        { json: "pulseScore", js: "pulseScore", typ: 0 },
        { json: "confidenceLevel", js: "confidenceLevel", typ: r("ConfidenceLevel") },
        { json: "lastScored", js: "lastScored", typ: Date },
        { json: "verificationStatus", js: "verificationStatus", typ: r("VerificationStatus") },
        { json: "listingHistory", js: "listingHistory", typ: a("any") },
        { json: "isActive", js: "isActive", typ: true },
        { json: "isClaimed", js: "isClaimed", typ: true },
        { json: "claimedAt", js: "claimedAt", typ: Date },
        { json: "flags", js: "flags", typ: u(undefined, a("any")) },
        { json: "endorsements", js: "endorsements", typ: u(undefined, a("any")) },
        { json: "firstSeen", js: "firstSeen", typ: Date },
        { json: "lastSeen", js: "lastSeen", typ: Date },
        { json: "createdAt", js: "createdAt", typ: Date },
        { json: "updatedAt", js: "updatedAt", typ: Date },
        { json: "verifiedAt", js: "verifiedAt", typ: u(undefined, Date) },
    ], false),
    "GetSellerByNamePublic": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetMySellerProfileData") },
    ], false),
    "GetSellerByIDPublic": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetMySellerProfileData") },
    ], false),
    "GetSellerPulseScorePublic": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetSellerPulseScorePublicData") },
    ], false),
    "GetSellerPulseScorePublicData": o([
        { json: "score", js: "score", typ: r("Score") },
    ], false),
    "Score": o([
        { json: "pulseScore", js: "pulseScore", typ: 0 },
        { json: "confidenceLevel", js: "confidenceLevel", typ: r("ConfidenceLevel") },
        { json: "lastScored", js: "lastScored", typ: Date },
        { json: "verificationStatus", js: "verificationStatus", typ: r("VerificationStatus") },
        { json: "totalFlags", js: "totalFlags", typ: 0 },
        { json: "totalEndorsements", js: "totalEndorsements", typ: 0 },
        { json: "netFeedbackScore", js: "netFeedbackScore", typ: 0 },
    ], false),
    "GetTopSellerByPulseScorePublic": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetTopSellerByPulseScorePublicData") },
    ], false),
    "GetTopSellerByPulseScorePublicData": o([
        { json: "sellers", js: "sellers", typ: a(r("PurpleSeller")) },
        { json: "count", js: "count", typ: 0 },
    ], false),
    "SearchSellersPublic": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("SearchSellersPublicData") },
    ], false),
    "SearchSellersPublicData": o([
        { json: "sellers", js: "sellers", typ: a(r("PurpleSeller")) },
        { json: "pagination", js: "pagination", typ: r("PurplePagination") },
    ], false),
    "PurplePagination": o([
        { json: "currentPage", js: "currentPage", typ: 0 },
        { json: "totalPages", js: "totalPages", typ: 0 },
        { json: "totalSellers", js: "totalSellers", typ: 0 },
        { json: "hasNext", js: "hasNext", typ: true },
        { json: "hasPrev", js: "hasPrev", typ: true },
    ], false),
    "FlagASeller": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
    ], false),
    "EndorseASeller": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
    ], false),
    "GetAllSellers": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetAllSellersData") },
    ], false),
    "GetAllSellersData": o([
        { json: "sellers", js: "sellers", typ: a(r("FluffySeller")) },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "total", js: "total", typ: u(undefined, 0) },
        { json: "stats", js: "stats", typ: u(undefined, r("Stats")) },
        { json: "query", js: "query", typ: u(undefined, r("Query")) },
        { json: "limit", js: "limit", typ: u(undefined, 0) },
        { json: "pagination", js: "pagination", typ: u(undefined, r("FluffyPagination")) },
    ], false),
    "FluffyPagination": o([
        { json: "currentPage", js: "currentPage", typ: 0 },
        { json: "totalPages", js: "totalPages", typ: 0 },
        { json: "totalItems", js: "totalItems", typ: 0 },
        { json: "itemsPerPage", js: "itemsPerPage", typ: 0 },
    ], false),
    "Query": o([
        { json: "isActive", js: "isActive", typ: true },
    ], false),
    "Stats": o([
        { json: "active", js: "active", typ: 0 },
        { json: "inactive", js: "inactive", typ: 0 },
        { json: "claimed", js: "claimed", typ: 0 },
        { json: "extracted", js: "extracted", typ: 0 },
    ], false),
    "RemoveAFlag": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("RemoveAFlagData") },
    ], false),
    "RemoveAFlagData": o([
        { json: "newPulseScore", js: "newPulseScore", typ: 0 },
        { json: "newConfidenceLevel", js: "newConfidenceLevel", typ: r("ConfidenceLevel") },
        { json: "totalFlags", js: "totalFlags", typ: 0 },
        { json: "netFeedbackScore", js: "netFeedbackScore", typ: 0 },
    ], false),
    "RemoveAnEndorsement": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("RemoveAFlagData") },
    ], false),
    "GetSellerFeedbackList": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetSellerFeedbackListData") },
    ], false),
    "GetSellerFeedbackListData": o([
        { json: "flags", js: "flags", typ: a("any") },
        { json: "endorsements", js: "endorsements", typ: a("any") },
        { json: "totalFlags", js: "totalFlags", typ: 0 },
        { json: "totalEndorsements", js: "totalEndorsements", typ: 0 },
        { json: "netFeedbackScore", js: "netFeedbackScore", typ: 0 },
    ], false),
    "GetSellerAnalytics": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetSellerAnalyticsData") },
    ], false),
    "GetSellerAnalyticsData": o([
        { json: "seller", js: "seller", typ: r("StickySeller") },
        { json: "feedback", js: "feedback", typ: r("Feedback") },
        { json: "listings", js: "listings", typ: r("Listings") },
        { json: "trustLevel", js: "trustLevel", typ: "" },
    ], false),
    "Feedback": o([
        { json: "totalFlags", js: "totalFlags", typ: 0 },
        { json: "totalEndorsements", js: "totalEndorsements", typ: 0 },
        { json: "netFeedbackScore", js: "netFeedbackScore", typ: 0 },
    ], false),
    "Listings": o([
        { json: "total", js: "total", typ: 0 },
        { json: "active", js: "active", typ: 0 },
        { json: "inactive", js: "inactive", typ: 0 },
        { json: "averagePrice", js: "averagePrice", typ: 0 },
    ], false),
    "StickySeller": o([
        { json: "id", js: "id", typ: "" },
        { json: "pulseScore", js: "pulseScore", typ: 0 },
        { json: "confidenceLevel", js: "confidenceLevel", typ: r("ConfidenceLevel") },
        { json: "verificationStatus", js: "verificationStatus", typ: r("VerificationStatus") },
        { json: "lastScored", js: "lastScored", typ: Date },
    ], false),
    "AdminLogin": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("AdminLoginData") },
    ], false),
    "AdminLoginData": o([
        { json: "admin", js: "admin", typ: r("User") },
        { json: "token", js: "token", typ: "" },
    ], false),
    "GetCurrentAdmin": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetCurrentAdminData") },
    ], false),
    "GetCurrentAdminData": o([
        { json: "admin", js: "admin", typ: r("User") },
    ], false),
    "GetSystemAnalytics": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetSystemAnalyticsData") },
    ], false),
    "GetSystemAnalyticsData": o([
        { json: "overview", js: "overview", typ: r("Overview") },
        { json: "recentActivity", js: "recentActivity", typ: r("RecentActivity") },
        { json: "platformDistribution", js: "platformDistribution", typ: a(r("Distribution")) },
        { json: "verificationDistribution", js: "verificationDistribution", typ: a(r("Distribution")) },
    ], false),
    "Overview": o([
        { json: "totalUsers", js: "totalUsers", typ: 0 },
        { json: "totalSellers", js: "totalSellers", typ: 0 },
        { json: "totalListings", js: "totalListings", typ: 0 },
        { json: "verifiedUsers", js: "verifiedUsers", typ: 0 },
        { json: "verifiedSellers", js: "verifiedSellers", typ: 0 },
        { json: "activeListings", js: "activeListings", typ: 0 },
        { json: "flaggedSellers", js: "flaggedSellers", typ: 0 },
        { json: "flaggedListings", js: "flaggedListings", typ: 0 },
    ], false),
    "Distribution": o([
        { json: "_id", js: "_id", typ: "" },
        { json: "count", js: "count", typ: 0 },
    ], false),
    "RecentActivity": o([
        { json: "users", js: "users", typ: 0 },
        { json: "sellers", js: "sellers", typ: 0 },
        { json: "listings", js: "listings", typ: 0 },
    ], false),
    "GetAllUsers": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetAllUsersData") },
    ], false),
    "GetAllUsersData": o([
        { json: "users", js: "users", typ: a(r("User")) },
        { json: "pagination", js: "pagination", typ: r("FluffyPagination") },
    ], false),
    "GetAUser": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetAUserData") },
    ], false),
    "GetAUserData": o([
        { json: "user", js: "user", typ: r("User") },
        { json: "sellers", js: "sellers", typ: a(r("TentacledSeller")) },
    ], false),
    "DeleteAUser": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
    ], false),
    "UpdateUserStatus": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("GetCurrentUserData") },
    ], false),
    "GetASeller": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetASellerData") },
    ], false),
    "GetASellerData": o([
        { json: "seller", js: "seller", typ: r("FluffySeller") },
        { json: "recentListings", js: "recentListings", typ: a("any") },
    ], false),
    "UpdateSellerStatus": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("GetMySellerProfileData") },
    ], false),
    "VerifySeller": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("UpdateSellerData") },
    ], false),
    "DeleteSeller": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
    ], false),
    "GetAllFlags": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("GetAllFlagsData") },
    ], false),
    "GetAllFlagsData": o([
        { json: "flags", js: "flags", typ: a(r("PurpleFlag")) },
        { json: "pagination", js: "pagination", typ: r("FluffyPagination") },
    ], false),
    "PurpleFlag": o([
        { json: "profileData", js: "profileData", typ: r("ProfileData") },
        { json: "scoringFactors", js: "scoringFactors", typ: r("ScoringFactors") },
        { json: "_id", js: "_id", typ: "" },
        { json: "userId", js: "userId", typ: null },
        { json: "sellerId", js: "sellerId", typ: "" },
        { json: "platform", js: "platform", typ: r("Platform") },
        { json: "profileUrl", js: "profileUrl", typ: "" },
        { json: "pulseScore", js: "pulseScore", typ: 0 },
        { json: "confidenceLevel", js: "confidenceLevel", typ: r("ConfidenceLevel") },
        { json: "lastScored", js: "lastScored", typ: Date },
        { json: "verificationStatus", js: "verificationStatus", typ: r("VerificationStatus") },
        { json: "listingHistory", js: "listingHistory", typ: a("any") },
        { json: "isActive", js: "isActive", typ: true },
        { json: "isClaimed", js: "isClaimed", typ: true },
        { json: "flags", js: "flags", typ: a(r("FlagFlag")) },
        { json: "endorsements", js: "endorsements", typ: a("any") },
        { json: "firstSeen", js: "firstSeen", typ: Date },
        { json: "lastSeen", js: "lastSeen", typ: Date },
        { json: "createdAt", js: "createdAt", typ: Date },
        { json: "updatedAt", js: "updatedAt", typ: Date },
    ], false),
    "FlagFlag": o([
        { json: "adminReview", js: "adminReview", typ: r("AdminReview") },
        { json: "userId", js: "userId", typ: r("FlagUserID") },
        { json: "reason", js: "reason", typ: "" },
        { json: "timestamp", js: "timestamp", typ: Date },
        { json: "isVerified", js: "isVerified", typ: true },
        { json: "_id", js: "_id", typ: "" },
    ], false),
    "AdminReview": o([
        { json: "reviewedBy", js: "reviewedBy", typ: "" },
        { json: "reviewedAt", js: "reviewedAt", typ: Date },
        { json: "action", js: "action", typ: "" },
        { json: "adminNotes", js: "adminNotes", typ: u(undefined, "") },
    ], false),
    "FlagUserID": o([
        { json: "_id", js: "_id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "email", js: "email", typ: "" },
    ], false),
    "ReviewFlags": o([
        { json: "success", js: "success", typ: true },
        { json: "message", js: "message", typ: "" },
        { json: "data", js: "data", typ: r("ReviewFlagsData") },
    ], false),
    "ReviewFlagsData": o([
        { json: "flag", js: "flag", typ: r("FluffyFlag") },
    ], false),
    "FluffyFlag": o([
        { json: "adminReview", js: "adminReview", typ: r("AdminReview") },
        { json: "userId", js: "userId", typ: "" },
        { json: "reason", js: "reason", typ: "" },
        { json: "timestamp", js: "timestamp", typ: Date },
        { json: "isVerified", js: "isVerified", typ: true },
        { json: "_id", js: "_id", typ: "" },
    ], false),
    "CheckSystemHealth": o([
        { json: "success", js: "success", typ: true },
        { json: "data", js: "data", typ: r("CheckSystemHealthData") },
    ], false),
    "CheckSystemHealthData": o([
        { json: "status", js: "status", typ: "" },
        { json: "timestamp", js: "timestamp", typ: Date },
        { json: "responseTime", js: "responseTime", typ: "" },
        { json: "database", js: "database", typ: r("Database") },
        { json: "uptime", js: "uptime", typ: 3.14 },
    ], false),
    "Database": o([
        { json: "status", js: "status", typ: "" },
        { json: "responseTime", js: "responseTime", typ: "" },
    ], false),
    "Role": [
        "admin",
        "seller",
        "user",
    ],
    "VerificationMethod": [
        "email",
    ],
    "VerificationStatus": [
        "id-verified",
        "unverified",
    ],
    "Platform": [
        "jiji",
    ],
    "Location": [
        "Lagos, Nigeria",
        "Not specified",
    ],
    "Name": [
        "Abdulsalam Sodeeq",
        "GADGET-WORLD",
        "John Doe",
        "Test Seller for Flagging 1",
    ],
    "ConfidenceLevel": [
        "high",
    ],
    "ID": [
        "68f3cc48cecb60e89241f78a",
        "68f3d5f08c314879d32bb56e",
    ],
    "SellerID": [
        "extracted-1760808008440",
        "user-68f01a554ef9b19af107aaa7-1760810480544",
    ],
};
