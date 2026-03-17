import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const deployYmlCode = `# .github/workflows/deploy.yml
# CI/CD pipeline: test + build + deploy on push to main

name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-east-1
  S3_BUCKET: brandonaboyd-resume
  CF_DISTRIBUTION_ID: \${{ secrets.CF_DISTRIBUTION_ID }}

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --watchAll=false --passWithNoTests

  build-and-deploy:
    name: Build and Deploy to S3
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build production bundle
        run: npm run build
        env:
          REACT_APP_GA_MEASUREMENT_ID: \${{ secrets.GA_MEASUREMENT_ID }}
          REACT_APP_CONTACT_API: \${{ secrets.CONTACT_API_URL }}

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: \${{ env.AWS_REGION }}

      - name: Deploy to S3
        run: |
          # Sync all files except index.html with long cache TTL
          aws s3 sync ./build s3://$S3_BUCKET \\
            --delete \\
            --exclude "index.html" \\
            --cache-control "public, max-age=31536000, immutable"
          # Deploy index.html with no-cache (always fresh)
          aws s3 cp ./build/index.html s3://$S3_BUCKET/index.html \\
            --cache-control "no-cache, no-store, must-revalidate"

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \\
            --distribution-id $CF_DISTRIBUTION_ID \\
            --paths "/*"

      - name: Deployment summary
        run: echo "Deployed commit \${{ github.sha }} to https://brandonaboyd.com"`;

const GitHub = () => {
  const [repos, setRepos] = useState([]);
  const [repoLoading, setRepoLoading] = useState(true);
  const [repoError, setRepoError] = useState(null);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_GITHUB_API_BASE}/users/${process.env.REACT_APP_GITHUB_USERNAME}/repos?sort=updated&per_page=6`)
      .then(res => {
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setRepos(data);
        setRepoLoading(false);
      })
      .catch(err => {
        setRepoError(err.message);
        setRepoLoading(false);
      });
  }, []);

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>GitHub</h1>
        <p className={styles.heroTagline}>Version control, CI/CD pipelines, and collaborative code management</p>
        <div className={styles.heroBadges}>
          {['Git', 'GitHub Actions', 'Pull Requests', 'Branching', 'CI/CD', 'Webhooks'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            GitHub is where all my code lives — automation scripts, infrastructure playbooks, this resume, and internal
            tooling. I follow a feature-branch workflow: branch from main, develop, open a PR, get a review, then merge.
            No direct pushes to main — ever.
          </p>
          <p className={styles.sectionText}>
            GitHub Actions handles automated deployments for this resume site: every push to main triggers a test,
            build, S3 sync, and CloudFront cache invalidation pipeline. The whole deployment takes under 3 minutes
            with zero manual steps.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Workflow Practices</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Branch protection</strong> — Main branch requires at least one
            PR review and passing CI checks before merging. Prevents direct pushes to production and maintains
            a clean, reviewable git history.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Conventional commits</strong> — Using prefixes like <code>feat:</code>,
            <code> fix:</code>, <code>chore:</code>, <code>docs:</code> for machine-readable changelogs and
            automated semantic versioning.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Secrets management</strong> — All sensitive values (API keys, AWS
            credentials) stored as GitHub Actions secrets or environment secrets — never in code or <code>.env</code> files
            committed to the repo.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Use branch protection rules on main. Require at least one PR review and passing
            CI checks before merging. This prevents direct pushes to production and maintains a clean git history
            — and it forces you to write CI that actually tests something meaningful.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — GitHub Actions CI/CD Pipeline</h2>
        <p className={styles.sectionText}>
          The workflow below is the actual <code>deploy.yml</code> that deploys this resume site to AWS S3 + CloudFront
          on every push to main. It runs tests first, then builds and deploys with proper cache headers.
        </p>
        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>yaml — .github/workflows/deploy.yml</div>
          <SyntaxHighlighter language="yaml" style={vscDarkPlus} showLineNumbers>
            {deployYmlCode}
          </SyntaxHighlighter>
        </div>
      </div>

      <div className={styles.liveSection}>
        <h2 className={styles.liveSectionTitle}>
          <span className={styles.liveDot} />
          Live GitHub Repositories
        </h2>
        <p className={styles.liveSubtitle}>
          Fetched live from the GitHub API — github.com/MrBoyd23
        </p>

        {repoLoading && <p className={styles.loading}>Loading repositories from GitHub API...</p>}
        {repoError && <p className={styles.error}>Could not load repositories: {repoError}</p>}

        {!repoLoading && !repoError && (
          <div className={styles.cardsGrid}>
            {repos.map(repo => (
              <div key={repo.id} className={styles.card}>
                <div className={styles.cardTitle}>{repo.name}</div>
                {repo.description && (
                  <p className={styles.cardMeta} style={{ color: '#aaa', fontSize: '0.8rem', lineHeight: 1.5, margin: '4px 0' }}>
                    {repo.description}
                  </p>
                )}
                <p className={styles.cardMeta}>
                  {repo.language && <span style={{ color: '#40e0d0', marginRight: '10px' }}>{repo.language}</span>}
                  <span className={styles.cardStar}>★ {repo.stargazers_count}</span>
                  {repo.fork && <span style={{ color: '#666', marginLeft: '8px', fontSize: '0.72rem' }}>fork</span>}
                </p>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cardLink}
                >
                  View on GitHub →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHub;
