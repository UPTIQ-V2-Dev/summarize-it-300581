import { summaryController } from "../../controllers/index.js";
import auth from "../../middlewares/auth.js";
import validate from "../../middlewares/validate.js";
import { summaryValidation } from "../../validations/index.js";
import express from 'express';
const router = express.Router();
// POST /api/summarize - Generate text summary
router
    .route('/summarize')
    .post(auth('manageSummaries'), validate(summaryValidation.summarize), summaryController.summarize);
// GET /api/history - Get user's summary history
// POST /api/history - Save summary to user's history
router
    .route('/history')
    .get(auth('getSummaries'), validate(summaryValidation.getHistory), summaryController.getHistory)
    .post(auth('manageSummaries'), validate(summaryValidation.saveHistory), summaryController.saveHistory);
// DELETE /api/history/{id} - Delete summary from user's history
router
    .route('/history/:id')
    .delete(auth('manageSummaries'), validate(summaryValidation.deleteHistory), summaryController.deleteHistory);
// GET /api/stats - Get user's summary statistics
router.route('/stats').get(auth('getSummaries'), summaryController.getStats);
export default router;
/**
 * @swagger
 * tags:
 *   name: Summaries
 *   description: Text summarization and history management
 */
/**
 * @swagger
 * /api/summarize:
 *   post:
 *     summary: Generate text summary
 *     description: Generate text summary with specified options
 *     tags: [Summaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 10
 *                 description: Text to summarize
 *               options:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: string
 *                     enum: [short, medium, long]
 *                     description: Length of summary
 *                   style:
 *                     type: string
 *                     enum: [paragraph, bullet, outline]
 *                     description: Style of summary
 *                   extractKeywords:
 *                     type: boolean
 *                     description: Whether to extract keywords
 *             example:
 *               text: "Long text to summarize..."
 *               options:
 *                 length: "medium"
 *                 style: "paragraph"
 *                 extractKeywords: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *                 wordCount:
 *                   type: integer
 *                 keywords:
 *                   type: array
 *                   items:
 *                     type: string
 *                 processingTime:
 *                   type: integer
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     originalWordCount:
 *                       type: integer
 *                     compressionRatio:
 *                       type: number
 *                     confidence:
 *                       type: number
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "422":
 *         $ref: '#/components/responses/UnprocessableEntity'
 */
/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get user's summary history
 *     description: Get paginated list of user's summary history
 *     tags: [Summaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   originalText:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   options:
 *                     type: object
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   wordCount:
 *                     type: integer
 *                   title:
 *                     type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   post:
 *     summary: Save summary to user's history
 *     description: Save a summary to the user's history
 *     tags: [Summaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalText
 *               - summary
 *               - options
 *               - title
 *               - wordCount
 *             properties:
 *               originalText:
 *                 type: string
 *               summary:
 *                 type: string
 *               options:
 *                 type: object
 *               title:
 *                 type: string
 *               wordCount:
 *                 type: integer
 *                 minimum: 1
 *             example:
 *               originalText: "Original text..."
 *               summary: "Summary text..."
 *               options:
 *                 length: "medium"
 *                 style: "paragraph"
 *                 extractKeywords: true
 *               title: "My Summary"
 *               wordCount: 25
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 originalText:
 *                   type: string
 *                 summary:
 *                   type: string
 *                 options:
 *                   type: object
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 wordCount:
 *                   type: integer
 *                 title:
 *                   type: string
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
/**
 * @swagger
 * /api/history/{id}:
 *   delete:
 *     summary: Delete summary from user's history
 *     description: Delete a specific summary from the user's history
 *     tags: [Summaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Summary ID
 *     responses:
 *       "204":
 *         description: No Content
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get user's summary statistics
 *     description: Get statistics about user's summarization activity
 *     tags: [Summaries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSummaries:
 *                   type: integer
 *                 totalWordsSummarized:
 *                   type: integer
 *                 averageCompressionRatio:
 *                   type: number
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
