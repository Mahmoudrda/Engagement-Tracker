___TERMS_OF_SERVICE___

By creating or modifying this file you agree to Google Tag Manager's Community
Template Gallery Developer Terms of Service available at
https://developers.google.com/tag-manager/gallery-tos (or such other URL as
Google may provide), as modified from time to time.


___INFO___

{
  "type": "TAG",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "Merkle Engagement Tracker",
  "brand": {
    "displayName": "Merkle Engagement Tracker"
  },
  "categories" : ["ANALYTICS" ]
  "description": "This template tracks user interactions on your site: it monitors scroll depth (percentage scrolled), file downloads, outbound link clicks (external site visits), and video events using the dataLayer",
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "TEXT",
    "name": "dataLayerName",
    "displayName": "dataLayer Name",
    "simpleValueType": true,
    "valueHint": "e.g. dataLayer",
    "valueValidators": [
      {
        "type": "STRING_LENGTH",
        "args": [
          1,
          30
        ]
      }
    ]
  },
  {
    "type": "CHECKBOX",
    "name": "Scroll",
    "checkboxText": "Scroll",
    "simpleValueType": true,
    "subParams": [
      {
        "type": "TEXT",
        "name": "scrollThresholds",
        "displayName": "Scroll Thresholds",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "Scroll",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "help": "The scroll percentage(s) to track, separated by commas",
        "valueHint": "e.g. 25, 50, 75, 100",
        "valueValidators": [
          {
            "type": "REGEX",
            "args": [
              "^\\d+(?:,\\d+)*$"
            ],
            "errorMessage": "Enter the scroll percentage(s) separated by commas with no spaces"
          },
          {
            "type": "NON_EMPTY"
          }
        ]
      },
      {
        "type": "SELECT",
        "name": "scrollDirection",
        "displayName": "Scroll Direction",
        "macrosInSelect": false,
        "selectItems": [
          {
            "value": "vertical",
            "displayValue": "vertical"
          },
          {
            "value": "horizontal",
            "displayValue": "horizontal"
          },
          {
            "value": "vertical, horizontal",
            "displayValue": "both"
          }
        ],
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "Scroll",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "help": "The scroll direction to track"
      }
    ],
    "help": "Tracks the user\u0027s scroll percentage"
  },
  {
    "type": "CHECKBOX",
    "name": "Downloads",
    "checkboxText": "Downloads",
    "simpleValueType": true,
    "subParams": [
      {
        "type": "TEXT",
        "name": "downloadExtensions",
        "displayName": "Download Extensions",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "Downloads",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "help": "The download extension(s) to track, separated by commas",
        "valueHint": "pdf, docx",
        "valueValidators": [
          {
            "type": "REGEX",
            "args": [
              "^[a-zA-Z]+(?:,[a-zA-Z]+)*$"
            ],
            "errorMessage": "Enter the download extension(s) to track, separated by commas, and with no spaces"
          },
          {
            "type": "NON_EMPTY"
          }
        ]
      }
    ],
    "help": "Tracks the user\u0027s downloads"
  },
  {
    "type": "CHECKBOX",
    "name": "Outbound",
    "checkboxText": "Outbound clicks",
    "simpleValueType": true,
    "subParams": [
      {
        "type": "TEXT",
        "name": "internalDomains",
        "displayName": "Internal Domains",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "Outbound",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "valueHint": "domian1.com, domain2.com",
        "help": "The internal domain(s), separated by commas",
        "valueValidators": [
          {
            "type": "REGEX",
            "args": [
              "^(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(?:,(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,})*$"
            ],
            "errorMessage": "Enter the domain(s) name separated by commas with no spaces",
            "enablingConditions": []
          },
          {
            "type": "NON_EMPTY"
          }
        ]
      }
    ],
    "help": "Tracks the user\u0027s outbound clicks"
  },
  {
    "type": "CHECKBOX",
    "name": "Videos",
    "checkboxText": "HTML 5 Videos",
    "simpleValueType": true,
    "subParams": [
      {
        "type": "CHECKBOX",
        "name": "play",
        "checkboxText": "Start",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "Videos",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "CHECKBOX",
        "name": "ended",
        "checkboxText": "Complete",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "Videos",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "CHECKBOX",
        "name": "pause",
        "checkboxText": "Pause",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "Videos",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "CHECKBOX",
        "name": "timeupdate",
        "checkboxText": "Progress Percent",
        "simpleValueType": true,
        "subParams": [
          {
            "type": "TEXT",
            "name": "percentage",
            "displayName": "Progress",
            "simpleValueType": true,
            "enablingConditions": [
              {
                "paramName": "timeupdate",
                "paramValue": true,
                "type": "EQUALS"
              }
            ],
            "help": "The progress percentage(s) to track, separated by commas",
            "valueHint": "25,50,75,100",
            "valueValidators": [
              {
                "type": "NON_EMPTY"
              }
            ]
          }
        ],
        "enablingConditions": [
          {
            "paramName": "Videos",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      }
    ],
    "help": "Tracks HTML 5 video events"
  },
  {
    "type": "CHECKBOX",
    "name": "youtube",
    "checkboxText": "You Tube Videos",
    "simpleValueType": true,
    "subParams": [
      {
        "type": "CHECKBOX",
        "name": "ytplay",
        "checkboxText": "Start",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "youtube",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "CHECKBOX",
        "name": "ytcomplete",
        "checkboxText": "Complete",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "youtube",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "CHECKBOX",
        "name": "ytpause",
        "checkboxText": "Pause",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "youtube",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "CHECKBOX",
        "name": "ytprogress",
        "checkboxText": "Progress",
        "simpleValueType": true,
        "subParams": [
          {
            "type": "TEXT",
            "name": "ytpercentage",
            "displayName": "Progress Percent",
            "simpleValueType": true,
            "enablingConditions": [
              {
                "paramName": "ytprogress",
                "paramValue": true,
                "type": "EQUALS"
              }
            ],
            "help": "The YouTube video progress percentage(s), separated by commas",
            "valueHint": "25,50,75,100",
            "valueValidators": [
              {
                "type": "NON_EMPTY"
              }
            ]
          }
        ],
        "enablingConditions": [
          {
            "paramName": "youtube",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      }
    ],
    "help": "Tracks YouTube embedded videos"
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

const log = require('logToConsole');
const injectScript = require('injectScript');
const callLater = require('callLater');
const callInWindow = require('callInWindow');


// Parse template inputs
const parseArrayInput = (input) => 
  input ? input.split(',').map(item => item.trim()) : [];
const videoevents = ['play','ended','pause','timeupdate','ytplay','ytpause','ytytcomplete','ytprogress'];
const truevideoevents = [];
for (let key in data) {
  if (data.hasOwnProperty(key)) {
    if (videoevents.indexOf(key) !== -1 && data[key] === true) {
      truevideoevents.push(key);
    }
  }
}
const yttruevideoevents = [];
for (let key in data) {
  if (data.hasOwnProperty(key)) {
    if (videoevents.indexOf(key) !== -1 && data[key] === true) {
      yttruevideoevents.push(key);
    }
  }
}



const userConfig = {
  dataLayerName: data.dataLayerName,
  scrollThresholds: parseArrayInput(data.scrollThresholds),
  scrollDirection: parseArrayInput(data.scrollDirection),
  downloadExtensions: parseArrayInput(data.downloadExtensions),
  internalDomains: parseArrayInput(data.internalDomains),
  videoEvents : truevideoevents,
  progressPercentage : parseArrayInput(data.percentage),
  youtube : data.youtube,
  youtubeEvents : yttruevideoevents,
  ytprogressPercentage : parseArrayInput(data.ytpercentage)
  
  
};






const templateLibrary = {
  init: () => {
    log('templateLibrary.init', userConfig);
    data.gtmOnSuccess();  
    callLater(function(){            
        callInWindow("startTracking", userConfig);
     });        
  }
};
 
const url = 'https://cdn.jsdelivr.net/npm/engagement_tracker@2.0.0/index.js';             
injectScript(url, templateLibrary.init, data.gtmOnFailure);


___WEB_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "logging",
        "versionId": "1"
      },
      "param": [
        {
          "key": "environments",
          "value": {
            "type": 1,
            "string": "debug"
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "access_globals",
        "versionId": "1"
      },
      "param": [
        {
          "key": "keys",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "startTracking"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "TrackingModule.init"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "inject_script",
        "versionId": "1"
      },
      "param": [
        {
          "key": "urls",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "https://cdn.jsdelivr.net/npm/engagement_tracker@2.0.0/index.js"
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios:
- name: injectscript testing
  code: |-
    const mockData = {
      dataLayerName: "dataLayer",
      scrollThresholds : '10,50',
      scrollDirection : "vertical",
      downloadExtensions : "pdf",
      internalDomains : "mahmoud.com"
    };

    runCode(mockData);

    assertApi('injectScript').wasCalled();


___NOTES___

Created on 2/17/2025, 1:44:47 PM


