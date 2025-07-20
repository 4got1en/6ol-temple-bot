// github.js - GitHub integration utilities for the temple bot
const { Octokit } = require('@octokit/rest');

class GitHubUtil {
    constructor(token) {
        this.octokit = new Octokit({
            auth: token
        });
    }

    /**
     * Create an issue in a repository
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name  
     * @param {string} title - Issue title
     * @param {string} body - Issue body
     */
    async createIssue(owner, repo, title, body) {
        try {
            const response = await this.octokit.issues.create({
                owner,
                repo,
                title,
                body
            });
            return response.data;
        } catch (error) {
            console.error('Error creating GitHub issue:', error);
            throw error;
        }
    }

    /**
     * Add a comment to an existing issue
     * @param {string} owner - Repository owner
     * @param {string} repo - Repository name
     * @param {number} issueNumber - Issue number
     * @param {string} body - Comment body
     */
    async addIssueComment(owner, repo, issueNumber, body) {
        try {
            const response = await this.octokit.issues.createComment({
                owner,
                repo,
                issue_number: issueNumber,
                body
            });
            return response.data;
        } catch (error) {
            console.error('Error adding GitHub comment:', error);
            throw error;
        }
    }
}

module.exports = GitHubUtil;