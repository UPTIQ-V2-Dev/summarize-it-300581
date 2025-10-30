import prisma from "../client.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from 'http-status';
/**
 * Process text summarization (mock implementation)
 * @param {string} text - Text to summarize
 * @param {Object} options - Summarization options
 * @returns {Promise<Object>} Summarization result
 */
const processSummarization = (text, options = {}) => {
    const startTime = Date.now();
    // Mock text processing logic - replace with actual AI summarization service
    const originalWordCount = text.split(/\s+/).length;
    if (originalWordCount < 10) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Text too short to summarize');
    }
    // Mock summarization based on length option
    const lengthMultiplier = options.length === 'short' ? 0.1 : options.length === 'long' ? 0.4 : 0.2;
    const targetWords = Math.max(10, Math.floor(originalWordCount * lengthMultiplier));
    // Create mock summary
    const words = text.split(/\s+/);
    const summary = words.slice(0, targetWords).join(' ') + '...';
    const wordCount = summary.split(/\s+/).length;
    // Mock keywords extraction
    const keywords = options.extractKeywords ? ['keyword1', 'keyword2', 'keyword3'] : undefined;
    const processingTime = Date.now() - startTime;
    const compressionRatio = originalWordCount / wordCount;
    const confidence = Math.random() * 0.3 + 0.7; // Mock confidence between 0.7-1.0
    return {
        summary,
        wordCount,
        keywords,
        processingTime,
        metadata: {
            originalWordCount,
            compressionRatio,
            confidence
        }
    };
};
/**
 * Create a summary
 * @param {Object} summaryData
 * @returns {Promise<Summary>}
 */
const createSummary = async (summaryData) => {
    return await prisma.summary.create({
        data: summaryData
    });
};
/**
 * Query for summaries
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @returns {Promise<Summary[]>}
 */
const querySummaries = async (filter, options, keys = [
    'id',
    'title',
    'originalText',
    'summaryText',
    'options',
    'wordCount',
    'originalWordCount',
    'compressionRatio',
    'confidence',
    'keywords',
    'processingTime',
    'createdAt',
    'updatedAt',
    'userId'
]) => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy || 'createdAt';
    const sortType = options.sortType ?? 'desc';
    const summaries = await prisma.summary.findMany({
        where: filter,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortType }
    });
    return summaries;
};
/**
 * Get summary by id
 * @param {number} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Summary, Key> | null>}
 */
const getSummaryById = async (id, keys = [
    'id',
    'title',
    'originalText',
    'summaryText',
    'options',
    'wordCount',
    'originalWordCount',
    'compressionRatio',
    'confidence',
    'keywords',
    'processingTime',
    'createdAt',
    'updatedAt',
    'userId'
]) => {
    return (await prisma.summary.findUnique({
        where: { id },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }));
};
/**
 * Update summary by id
 * @param {number} summaryId
 * @param {Object} updateBody
 * @returns {Promise<Summary>}
 */
const updateSummaryById = async (summaryId, updateBody, keys = [
    'id',
    'title',
    'originalText',
    'summaryText',
    'options',
    'wordCount',
    'originalWordCount',
    'compressionRatio',
    'confidence',
    'keywords',
    'processingTime',
    'createdAt',
    'updatedAt',
    'userId'
]) => {
    const summary = await getSummaryById(summaryId, ['id', 'userId']);
    if (!summary) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Summary not found');
    }
    const updatedSummary = await prisma.summary.update({
        where: { id: summaryId },
        data: updateBody,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    });
    return updatedSummary;
};
/**
 * Delete summary by id
 * @param {number} summaryId
 * @returns {Promise<Summary>}
 */
const deleteSummaryById = async (summaryId) => {
    const summary = await getSummaryById(summaryId);
    if (!summary) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Summary not found');
    }
    await prisma.summary.delete({ where: { id: summaryId } });
    return summary;
};
/**
 * Get user summary statistics
 * @param {number} userId
 * @returns {Promise<Object>}
 */
const getUserSummaryStats = async (userId) => {
    const stats = await prisma.summary.aggregate({
        where: { userId },
        _count: { id: true },
        _sum: { originalWordCount: true },
        _avg: { compressionRatio: true }
    });
    return {
        totalSummaries: stats._count.id || 0,
        totalWordsSummarized: stats._sum.originalWordCount || 0,
        averageCompressionRatio: Math.round((stats._avg.compressionRatio || 0) * 100) / 100
    };
};
export default {
    processSummarization,
    createSummary,
    querySummaries,
    getSummaryById,
    updateSummaryById,
    deleteSummaryById,
    getUserSummaryStats
};
