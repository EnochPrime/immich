# Config File

A config file can be provided as an alternative to the UI configuration.

### Step 1 - Create a new config file

In JSON format, create a new config file (e.g. `immich.config`) and put it in a location that can be accessed by Immich.
The default configuration looks like this:

```json
{
  "ffmpeg": {
    "crf": 23,
    "threads": 0,
    "preset": "ultrafast",
    "targetVideoCodec": "h264",
    "targetAudioCodec": "aac",
    "targetResolution": "720",
    "maxBitrate": "0",
    "twoPass": false,
    "transcode": "required",
    "tonemap": "hable",
    "accel": "disabled"
  },
  "job": {
    "backgroundTask": {
      "concurrency": 5
    },
    "clipEncoding": {
      "concurrency": 2
    },
    "metadataExtraction": {
      "concurrency": 5
    },
    "objectTagging": {
      "concurrency": 2
    },
    "recognizeFaces": {
      "concurrency": 2
    },
    "search": {
      "concurrency": 5
    },
    "sidecar": {
      "concurrency": 5
    },
    "storageTemplateMigration": {
      "concurrency": 5
    },
    "thumbnailGeneration": {
      "concurrency": 5
    },
    "videoConversion": {
      "concurrency": 1
    }
  },
  "oauth": {
    "enabled": false,
    "issuerUrl": "",
    "clientId": "",
    "clientSecret": "",
    "mobileOverrideEnabled": false,
    "mobileRedirectUri": "",
    "scope": "openid email profile",
    "storageLabelClaim": "preferred_username",
    "buttonText": "Login with OAuth",
    "autoRegister": true,
    "autoLaunch": false
  },
  "passwordLogin": {
    "enabled": true
  },
  "storageTemplate": {
    "template": "{{y}}/{{y}}-{{MM}}-{{dd}}/{{filename}}"
  },
  "thumbnail": {
    "webpSize": 250,
    "jpegSize": 1440
  }
}
```

:::tip
In Administration > Settings is a button to copy the current configuration to your clipboard.
So you can just grab it from there, paste it into a file and you're pretty much good to go.
:::

### Step 2 - Specify the file location

In your `.env` file, set the variable `IMMICH_CONFIG_FILE` to the path of your config.
For more information, refer to the [Environment Variables](https://docs.immich.app/docs/install/environment-variables) section.
