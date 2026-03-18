import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const s3HostingCode = `#!/bin/bash
# Deploy static site to S3 + CloudFront + Route 53

BUCKET="my-resume-site"
DOMAIN="resume.brandonaboyd.com"
REGION="us-east-1"

# 1. Create S3 bucket
aws s3api create-bucket \\
  --bucket "$BUCKET" \\
  --region "$REGION"

# 2. Disable Block Public Access (required for static hosting)
aws s3api put-public-access-block \\
  --bucket "$BUCKET" \\
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# 3. Enable static website hosting
aws s3 website "s3://$BUCKET" \\
  --index-document index.html \\
  --error-document index.html

# 4. Apply public-read bucket policy
aws s3api put-bucket-policy --bucket "$BUCKET" --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::'"$BUCKET"'/*"
  }]
}'

# 5. Sync build output to S3
aws s3 sync ./build "s3://$BUCKET" \\
  --delete \\
  --cache-control "max-age=31536000" \\
  --exclude "index.html"

aws s3 cp ./build/index.html "s3://$BUCKET/index.html" \\
  --cache-control "no-cache, no-store, must-revalidate"

echo "Deploy complete: http://$BUCKET.s3-website-$REGION.amazonaws.com"`;

const cloudfrontCode = `# Create CloudFront distribution pointing to S3
aws cloudfront create-distribution \\
  --distribution-config '{
    "CallerReference": "my-resume-'$(date +%s)'",
    "Origins": {
      "Quantity": 1,
      "Items": [{
        "Id": "S3-my-resume-site",
        "DomainName": "my-resume-site.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-my-resume-site",
      "ViewerProtocolPolicy": "redirect-to-https",
      "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
      "Compress": true
    },
    "Aliases": {
      "Quantity": 1,
      "Items": ["resume.brandonaboyd.com"]
    },
    "ViewerCertificate": {
      "ACMCertificateArn": "arn:aws:acm:us-east-1:123456789:certificate/abc123",
      "SSLSupportMethod": "sni-only",
      "MinimumProtocolVersion": "TLSv1.2_2021"
    },
    "Enabled": true,
    "Comment": "Resume site CDN"
  }'`;

const route53Code = `# Update Route 53 A record to point to CloudFront
HOSTED_ZONE_ID="Z1234567890ABC"
CF_DOMAIN="d1234abcd.cloudfront.net"

aws route53 change-resource-record-sets \\
  --hosted-zone-id "$HOSTED_ZONE_ID" \\
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "resume.brandonaboyd.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "'"$CF_DOMAIN"'",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'

# Verify propagation
aws route53 list-resource-record-sets \\
  --hosted-zone-id "$HOSTED_ZONE_ID" \\
  --query "ResourceRecordSets[?Name=='resume.brandonaboyd.com.']"`;

const AWS = () => {
  const [activeTab, setActiveTab] = useState('s3');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Amazon Web Services</h1>
        <p className={styles.heroTagline}>Cloud infrastructure for scalable, resilient deployments</p>
        <div className={styles.heroBadges}>
          {['EC2', 'S3', 'Route 53', 'CloudWatch', 'IAM', 'CLI'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            AWS is central to the enterprise cloud environments I support. I manage EC2 instances across multiple accounts — starting,
            stopping, and resizing instances in response to capacity tickets and incident escalations. I configure S3 bucket
            policies for customer data, update Route 53 DNS records during migrations, and set up CloudWatch alarms for
            CPU, disk, and network thresholds.
          </p>
          <p className={styles.sectionText}>
            The AWS CLI is my primary interface — I write bash scripts that target multiple accounts using named profiles,
            enabling bulk operations across a fleet. I also use IAM to audit over-permissioned roles and enforce least-privilege
            access as part of security review cycles.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Services I Work With</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>EC2</strong> — Instance lifecycle management, EBS volume expansion,
            security group rule updates, AMI snapshots for pre-maintenance backups.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>S3</strong> — Static site hosting, bucket policy management, lifecycle rules
            for log archiving, cross-account replication for DR.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>CloudWatch</strong> — Custom metric alarms, log group subscriptions,
            composite alarms for multi-condition alerting, dashboards for team operations.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>IAM</strong> — Role-based access for EC2 and Lambda, policy auditing,
            permission boundary enforcement, cross-account role trust relationships.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Always use IAM roles instead of long-lived access keys for EC2 instances.
            If a key leaks, a role can be revoked instantly without credential rotation across every system that uses it.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — Static Site on S3 + CloudFront + Route 53</h2>
        <p className={styles.sectionText}>
          This resume site is hosted on S3 with CloudFront CDN and Route 53 DNS — deployed entirely via the AWS CLI.
          The pattern below is production-ready and handles cache invalidation, HTTPS enforcement, and DNS alias records.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['s3', 'S3 setup + sync'], ['cf', 'CloudFront'], ['r53', 'Route 53']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>bash — AWS CLI</div>
          <SyntaxHighlighter language="bash" style={vscDarkPlus} showLineNumbers>
            {activeTab === 's3' ? s3HostingCode : activeTab === 'cf' ? cloudfrontCode : route53Code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default AWS;
