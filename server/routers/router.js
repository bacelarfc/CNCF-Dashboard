import express from 'express';
import axios from 'axios'; 

const router = express.Router();
const githubToken = "";

router.get('/api/github/stars/:owner/:repo', async (req, res) => {
    const { owner, repo } = req.params;

    try {
        let starHistory = await fetchStarHistoryFromGitHub(owner, repo);
        let starCountByYear = aggregateStarsByYear(starHistory);

        res.json(starCountByYear);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

function aggregateStarsByYear(starHistory) {
    const starCountByYear = {};

    starHistory.forEach(starDate => {
        const year = new Date(starDate).getFullYear();
        starCountByYear[year] = (starCountByYear[year] || 0) + 1;
    });

    return starCountByYear;
}
async function fetchStarHistoryFromGitHub(owner, repo) {
    let page = 1;
    let allStars = [];
    let lastPage = false;
    

    while (!lastPage) {
        try {
            const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/stargazers`, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3.star+json'
                },
                params: {
                    'per_page': 100,
                    'page': page
                }
            });

            if (response.data.length > 0) {
                allStars = allStars.concat(response.data.map(entry => entry.starred_at));
                page++;
            } else {
                lastPage = true;
            }
        } catch (error) {
            console.error('Error fetching from GitHub:', error);
            break;
        }
    }
    return allStars;
}
export default router;