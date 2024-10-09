import json
import pywhatkit as kit

def handler(event, context):
    try:
        # Parse incoming request body (from React)
        body = json.loads(event['body'])
        matches = body['matches']
        
        results = []
        for match in matches:
            santa = match['santa']
            recipient = match['recipient']
            message = f"Hey {santa['name']}, you will be gifting {recipient['name']} this year! 🎁"
            result = send_whatsapp_message(santa['phone'], message)
            results.append(result)
        
        return {
            'statusCode': 200,
            'body': json.dumps({'results': results})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def send_whatsapp_message(phone, message):
    try:
        # Sends a WhatsApp message instantly
        kit.sendwhatmsg_instantly(phone, message, wait_time=15, tab_close=True)
        return f"Message sent to {phone}"
    except Exception as e:
        return f"Failed to send message to {phone}: {e}"
