export const buildNewModalView = function () {
  return {
    "type": "modal",
    "callback_id": "deny-reason-submission",
    "title": {
      "type": "plain_text",
      "text": "Reason for the denial",
    },
    "blocks": [
      {
        "type": "input",
        "block_id": crypto.randomUUID(),
        "element": {
          "type": "plain_text_input",
          "action_id": "deny-reason",
          "multiline": true,
          "initial_value": "",
          "placeholder": {
            "type": "plain_text",
            "text": "Share the reason why you denied the request in detail",
          },
        },
        "label": {
          "type": "plain_text",
          "text": "Reason",
        },
      },
      {
        "type": "actions",
        "block_id": "clear",
        "elements": [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Clear all the inputs",
            },
            action_id: "clear-inputs",
            style: "danger",
          },
        ],
      },
    ],
    "submit": {
      "type": "plain_text",
      "text": "Confirm",
    },
  };
};

export const buildConfirmationView = function (reason: string) {
  return {
    "type": "modal",
    "callback_id": "deny-reason-confirmation",
    "title": {
      "type": "plain_text",
      "text": "Reason for the denial",
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": reason,
        },
      },
    ],
    "submit": {
      "type": "plain_text",
      "text": "Submit",
    },
  };
};
