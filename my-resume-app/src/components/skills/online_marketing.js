import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const gtmTagCode = `// GTM Tag Configuration — WooCommerce Purchase Conversion Tracking
// Fires on: WooCommerce thank-you page (URL contains /order-received/)

// 1. dataLayer push — added to WooCommerce thank-you page template
// This fires when the order confirmation page loads in WordPress/WooCommerce
// Add via functions.php or a custom plugin hook:

add_action('woocommerce_thankyou', 'push_purchase_datalayer', 10, 1);

function push_purchase_datalayer($order_id) {
  $order = wc_get_order($order_id);
  if (!$order) return;

  $items = [];
  foreach ($order->get_items() as $item) {
    $items[] = [
      'item_id'    => $item->get_product_id(),
      'item_name'  => $item->get_name(),
      'price'      => $item->get_total() / $item->get_quantity(),
      'quantity'   => $item->get_quantity(),
    ];
  }

  $data = [
    'event'          => 'purchase',
    'ecommerce'      => [
      'transaction_id' => $order->get_order_number(),
      'value'          => $order->get_total(),
      'tax'            => $order->get_total_tax(),
      'shipping'       => $order->get_shipping_total(),
      'currency'       => $order->get_currency(),
      'items'          => $items,
    ],
  ];

  // Output dataLayer push inline on the page
  echo '<script>';
  echo 'window.dataLayer = window.dataLayer || [];';
  echo 'window.dataLayer.push(' . json_encode($data) . ');';
  echo '</script>';
}`;

const gtmConfigCode = `// GTM Container — Tag, Trigger, and Variable configuration
// Import this JSON into GTM > Admin > Import Container

{
  "exportFormatVersion": 2,
  "containerVersion": {
    "container": { "publicId": "GTM-XXXXXXX" },

    "variable": [
      {
        "name": "DLV - transaction_id",
        "type": "v",
        "parameter": [
          { "type": "template", "key": "name", "value": "ecommerce.transaction_id" }
        ]
      },
      {
        "name": "DLV - purchase value",
        "type": "v",
        "parameter": [
          { "type": "template", "key": "name", "value": "ecommerce.value" }
        ]
      }
    ],

    "trigger": [
      {
        "name": "Purchase Event",
        "type": "CUSTOM_EVENT",
        "customEventFilter": [
          {
            "type": "EQUALS",
            "parameter": [
              { "type": "template", "key": "arg0", "value": "{{_event}}" },
              { "type": "template", "key": "arg1", "value": "purchase" }
            ]
          }
        ]
      }
    ],

    "tag": [
      {
        "name": "GA4 - Purchase Event",
        "type": "googtag",
        "parameter": [
          { "type": "template", "key": "id", "value": "G-XXXXXXXXXX" },
          {
            "type": "template",
            "key": "eventName",
            "value": "purchase"
          },
          {
            "type": "map",
            "key": "eventParameters",
            "map": [
              { "type": "template", "key": "transaction_id", "value": "{{DLV - transaction_id}}" },
              { "type": "template", "key": "value", "value": "{{DLV - purchase value}}" },
              { "type": "template", "key": "currency", "value": "USD" }
            ]
          }
        ],
        "firingTriggerId": ["Purchase Event"]
      },

      {
        "name": "Meta Pixel - Purchase",
        "type": "html",
        "parameter": [
          {
            "type": "template",
            "key": "html",
            "value": "<script>fbq('track', 'Purchase', { value: {{DLV - purchase value}}, currency: 'USD' });</script>"
          }
        ],
        "firingTriggerId": ["Purchase Event"]
      }
    ]
  }
}`;

const Online_Marketing = () => {
  const [activeTab, setActiveTab] = useState('datalayer');

  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Online Marketing</h1>
        <p className={styles.heroTagline}>Technical implementation of marketing strategies and conversion optimization</p>
        <div className={styles.heroBadges}>
          {['GTM', 'Facebook Pixel', 'A/B Testing', 'Landing Pages', 'Email Marketing', 'Tracking Pixels'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How I Use It Daily</h2>
          <p className={styles.sectionText}>
            My role in online marketing is on the technical implementation side — I'm the person who makes the marketing
            team's plans actually work on the web. That means setting up tracking pixels, configuring GTM containers,
            implementing <code>dataLayer</code> pushes for e-commerce events, and ensuring landing page performance
            meets conversion targets through server-side optimizations.
          </p>
          <p className={styles.sectionText}>
            I've implemented Google Ads conversion tracking, Facebook/Meta Pixel purchase events, LinkedIn Insight Tags,
            and TikTok Pixel — all managed through a single GTM container to maintain a clean, auditable tracking architecture
            rather than hardcoding each script directly into HTML.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>GTM Architecture Principles</h2>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Single container for all pixels</strong> — One GTM container replaces
            all hardcoded tracking scripts. Marketing can add/modify tags without developer involvement, and you get
            a centralized audit trail of what's firing and when.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>dataLayer-driven events</strong> — E-commerce events (add-to-cart,
            purchase, checkout steps) push structured data to the <code>dataLayer</code> from the backend. GTM tags
            read these variables and forward to GA4, Meta Pixel, and Google Ads simultaneously.
          </p>
          <p className={styles.sectionText}>
            <strong style={{ color: '#ff9999' }}>Server-side GTM</strong> — For high-traffic and privacy-sensitive
            deployments, I've worked with server-side GTM configurations that process events on the server before
            forwarding to ad platforms, improving ad signal quality and bypassing client-side blocking.
          </p>
          <div className={styles.tipBox}>
            <strong>Pro Tip:</strong> Use a single GTM container for all tracking pixels rather than hardcoding each
            one into the HTML. This lets marketing add/remove tags without touching code, gives you a centralized
            audit trail of what's firing, and makes debugging dramatically easier with GTM's Preview mode.
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Real-World Use Case — WooCommerce Purchase Conversion Tracking</h2>
        <p className={styles.sectionText}>
          Setting up GA4 purchase events + Facebook Pixel purchase events through GTM for a WooCommerce store.
          The <code>dataLayer</code> push fires from the WooCommerce thank-you page, and GTM reads it to fire all
          conversion tags simultaneously — no duplicate pixel implementations needed.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {[['datalayer', 'WooCommerce dataLayer push (PHP)'], ['gtm', 'GTM container config']].map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === key ? '#8b0000' : '#1e1e1e', color: activeTab === key ? '#fff' : '#888'
            }}>{label}</button>
          ))}
        </div>

        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>{activeTab === 'datalayer' ? 'php — functions.php (WooCommerce hook)' : 'json — GTM container export'}</div>
          <SyntaxHighlighter language={activeTab === 'datalayer' ? 'php' : 'json'} style={vscDarkPlus} showLineNumbers>
            {activeTab === 'datalayer' ? gtmTagCode : gtmConfigCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Online_Marketing;
