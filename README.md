# Pincture Full-stack App ｜圖片分享收藏平台

Website Demo: https://pincture-full-stack-app.vercel.app

<img width="700" alt="截圖 2023-02-19 23 02 42-min" src="https://user-images.githubusercontent.com/104335056/222036607-ca06dffc-f73f-4b12-800e-4221de3d07b7.png">

## API Doc

### GET /api/pins/:id

Response 200 OK

```json
{
  "pin": {
    "image": {
      "asset": {
        "url": "https://example.com/image.png"
      }
    },
    "_id": "abcd1234",
    "userId": "efgh5678",
    "title": "My Awesome Pin",
    "about": "This pin is awesome!",
    "category": "Travel",
    "destination": "Paris",
    "postedBy": {
      "_id": "ijkl9012",
      "name": "John Doe",
      "image": "https://example.com/avatar.png"
    },
    "save": [
      {
        "_key": "mnop3456",
        "userId": "qrst7890"
      }
    ]
  },
  "comments": [
    {
      "_id": "stuv2345",
      "userId": "wxyz6789",
      "text": "Great pin!",
      "createdAt": "2022-05-01T10:00:00.000Z"
    }
  ],
  "message": "成功"
}
```

Respones 404 Not Found

```json
{
  "message": "Pin not found"
}
```
