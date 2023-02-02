import { createHandler } from "@api/handler";

const handler = createHandler();        

handler.post(async (req, res) => {
  // const a = await postMessage("#boss-users", "+97688109008, Asia/Ulaanbaatar, <!here>");
  // console.log(a);
  return res.sendSuccess({});
});
export default handler;
// {
// 	"title": {
// 		"type": "plain_text",
// 		"text": "Send Message To User",
// 		"emoji": true
// 	},
// 	"submit": {
// 		"type": "plain_text",
// 		"text": "Send",
// 		"emoji": true
// 	},
// 	"type": "modal",
// 	"close": {
// 		"type": "plain_text",
// 		"text": "Cancel",
// 		"emoji": true
// 	},
// 	"blocks": [
// 		{
// 			"type": "input",
// 			"element": {
// 				"type": "plain_text_input",
// 				"action_id": "ml_input",
// 				"multiline": true,
// 				"placeholder": {
// 					"type": "plain_text",
// 					"text": "Your text goes here"
// 				}
// 			},
// 			"label": {
// 				"type": "plain_text",
// 				"text": "Your text goes here"
// 			},
// 			"hint": {
// 				"type": "plain_text",
// 				"text": "After sending message BOT cant reply automatically"
// 			}
// 		},
// 		{
// 			"type": "section",
// 			"text": {
// 				"type": "mrkdwn",
// 				"text": "Check to turn on Auto Reply."
// 			},
// 			"accessory": {
// 				"type": "checkboxes",
// 				"options": [
// 					{
// 						"text": {
// 							"type": "mrkdwn",
// 							"text": "Turn on Auto Reply"
// 						},
// 						"value": "value-0"
// 					}
// 				],
// 				"action_id": "checkboxes-action"
// 			}
// 		}
// 	]
// }