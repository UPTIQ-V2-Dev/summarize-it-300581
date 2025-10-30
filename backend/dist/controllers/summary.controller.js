import { summaryService } from "../services/index.js";
import ApiError from "../utils/ApiError.js";
import catchAsyncWithAuth from "../utils/catchAsyncWithAuth.js";
import pick from "../utils/pick.js";
import httpStatus from 'http-status';
const summarize = catchAsyncWithAuth((req, res) => {
    const { text, options = {} } = req.body;
    const result = summaryService.processSummarization(text, options);
    res.status(httpStatus.OK).send(result);
});
const getHistory = catchAsyncWithAuth(async (req, res) => {
    const options = pick(req.validatedQuery, ['page', 'limit']);
    const filter = { userId: req.user.id };
    const summaries = await summaryService.querySummaries(filter, options, [
        'id',
        'originalText',
        'summaryText',
        'options',
        'createdAt',
        'wordCount',
        'title'
    ]);
    // Transform the results to match API spec format
    const transformedResults = summaries.map(summary => ({
        id: summary.id.toString(),
        originalText: summary.originalText,
        summary: summary.summaryText,
        options: typeof summary.options === 'string' ? JSON.parse(summary.options) : summary.options,
        createdAt: summary.createdAt.toISOString(),
        wordCount: summary.wordCount,
        title: summary.title
    }));
    res.send(transformedResults);
});
const saveHistory = catchAsyncWithAuth(async (req, res) => {
    const { originalText, summary, options, title, wordCount } = req.body;
    // For saving history, we need to calculate additional fields
    const originalWordCount = originalText.split(/\s+/).length;
    const compressionRatio = originalWordCount / wordCount;
    const summaryData = {
        title,
        originalText,
        summaryText: summary,
        options: JSON.stringify(options),
        wordCount,
        originalWordCount,
        compressionRatio,
        confidence: 0.85, // Default confidence for saved summaries
        keywords: options.extractKeywords ? JSON.stringify(['keyword1', 'keyword2']) : undefined,
        processingTime: 1000, // Default processing time for saved summaries
        userId: req.user.id
    };
    const savedSummary = await summaryService.createSummary(summaryData);
    // Transform response to match API spec
    const response = {
        id: savedSummary.id.toString(),
        originalText: savedSummary.originalText,
        summary: savedSummary.summaryText,
        options: JSON.parse(savedSummary.options),
        createdAt: savedSummary.createdAt.toISOString(),
        wordCount: savedSummary.wordCount,
        title: savedSummary.title
    };
    res.status(httpStatus.CREATED).send(response);
});
const deleteHistory = catchAsyncWithAuth(async (req, res) => {
    const summaryId = parseInt(req.params.id);
    const summary = await summaryService.getSummaryById(summaryId, ['userId']);
    if (!summary) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Summary not found');
    }
    // Check if user owns this summary
    if (summary.userId !== req.user.id) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Cannot delete summary that belongs to another user');
    }
    await summaryService.deleteSummaryById(summaryId);
    res.status(httpStatus.NO_CONTENT).send();
});
const getStats = catchAsyncWithAuth(async (req, res) => {
    const stats = await summaryService.getUserSummaryStats(req.user.id);
    res.send(stats);
});
export default {
    summarize,
    getHistory,
    saveHistory,
    deleteHistory,
    getStats
};
