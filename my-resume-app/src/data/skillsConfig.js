/**
 * src/data/skillsConfig.js
 *
 * Single source of truth for all skill definitions.
 * Adding a new skill only requires an entry here — routes, nav bubbles,
 * and detail pages are generated automatically.
 *
 * Skills without a custom component file automatically render the
 * SkillDetail placeholder component until real content is added.
 */

// Skills that have their own custom component in src/components/skills/
export const CUSTOM_SKILL_IDS = new Set([
  'api',              // Weather widget + TMDb browser (api.js → api2 + api3)
  'ansible',          // GitHub Ansible playbooks viewer
  'bash_scripting',   // GitHub Bash scripts viewer
  'css',              // CSS code viewer from GitHub
  'html',             // Contact form
  'javascript',       // GitHub component browser
  'apache',
  'php',
  'aws',
  'mysql',
  'python',
  'node',
  'react',
  'web_design',
  'phpmyadmin',
  'cpanel',
  'plesk',
  'seo',
  'jira',
  'github',
  'grafana',
  'prometheus',
  'servicenow',
  'liveperson',
  'wordpress',
  'e-commerce',
  'linux_admin',
  'website_analytics',
  'online_marketing',
  'data_analytics',
  'ai_development',
]);

export const codingSkills = [
  { id: 'ai_development', label: 'AI Development' },
  { id: 'react',          label: 'React'           },
  { id: 'node',           label: 'Node.js'         },
  { id: 'ansible',        label: 'Ansible'         },
  { id: 'aws',            label: 'AWS'             },
  { id: 'python',         label: 'Python'          },
  { id: 'javascript',     label: 'JavaScript'      },
  { id: 'api',            label: 'API'             },
  { id: 'web_design',     label: 'Web Design'      },
  { id: 'bash_scripting', label: 'Bash Scripting'  },
  { id: 'css',            label: 'CSS'             },
  { id: 'mysql',          label: 'MySQL'           },
  { id: 'php',            label: 'PHP'             },
  { id: 'phpmyadmin',     label: 'phpMyAdmin'      },
  { id: 'html',           label: 'HTML'            },
  { id: 'apache',         label: 'Apache'          },
];

export const softwareSkills = [
  { id: 'cpanel',            label: 'cPanel'            },
  { id: 'plesk',             label: 'Plesk'             },
  { id: 'seo',               label: 'SEO'               },
  { id: 'jira',              label: 'Jira'              },
  { id: 'github',            label: 'GitHub'            },
  { id: 'grafana',           label: 'Grafana'           },
  { id: 'prometheus',        label: 'Prometheus'        },
  { id: 'servicenow',        label: 'ServiceNow'        },
  { id: 'liveperson',        label: 'LivePerson'        },
  { id: 'wordpress',         label: 'WordPress'         },
  { id: 'e-commerce',        label: 'ECommerce'         },
  { id: 'linux_admin',       label: 'Linux Admin'       },
  { id: 'website_analytics', label: 'Website Analytics' },
  { id: 'online_marketing',  label: 'Online Marketing'  },
  { id: 'data_analytics',    label: 'Data Analytics'    },
];

// Combined list with category tag — used in App.js to build routes
export const allSkills = [
  ...codingSkills.map(s  => ({ ...s, category: 'coding'   })),
  ...softwareSkills.map(s => ({ ...s, category: 'software' })),
];
