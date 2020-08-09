"use strict";
import axios from "axios";
import { APIGatewayProxyEvent } from "aws-lambda";
import * as aws from "aws-sdk";
import "source-map-support/register";

class Handler {
  private rekoSvc: aws.Rekognition;
  private translatorSvc: aws.Translate;
  constructor({ rekoSvc, translatorSvc }) {
    this.rekoSvc = rekoSvc;
    this.translatorSvc = translatorSvc;
  }

  async detectImageLabels(buffer: Buffer) {
    const result = await this.rekoSvc
      .detectLabels({
        Image: {
          Bytes: buffer,
        },
      })
      .promise();

    const workingItems = result.Labels.filter(
      ({ Confidence }) => Confidence > 80
    );

    const names = workingItems.map(({ Name }) => Name).join(" | ");

    return { names, workingItems };
  }

  async translateText(text: string) {
    const params = {
      SourceLanguageCode: "en",
      TargetLanguageCode: "pt",
      Text: text,
    };
    const { TranslatedText } = await this.translatorSvc
      .translateText(params)
      .promise();
    return TranslatedText.split(" | ");
  }

  formatFinalText({ translatedNames, workingItems }) {
    const finalText = [];
    for (const index in workingItems) {
      const nameInPortuguese = translatedNames[index];
      const currentItemConfidence = workingItems[index].Confidence;
      finalText.push(
        `${currentItemConfidence.toFixed(
          2
        )}% de chance de conter ${nameInPortuguese}`
      );
    }
    return finalText;
  }

  async getImageBuffer(imageUrl: string) {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data, "base64");
    return buffer;
  }

  async main(event: APIGatewayProxyEvent) {
    try {
      const { imageUrl } = event.queryStringParameters;
      console.log("Fetching image buffer...");
      const imageBuffer = await this.getImageBuffer(imageUrl);
      console.log("Detecting labels...");
      const { names, workingItems } = await this.detectImageLabels(imageBuffer);

      console.log("Translating to portuguese...");
      const translatedNames = await this.translateText(names);

      console.log("Handling final text...");
      const finalText = this.formatFinalText({
        translatedNames,
        workingItems,
      });
      return {
        statusCode: 200,
        body: JSON.stringify(finalText),
      };
    } catch (e) {
      console.log("ERROR***", e);
      return {
        statusCode: 500,
        body: "Internal server error!",
      };
    }
  }
}

const trantranslate = new aws.Translate();
const reko = new aws.Rekognition();

const handler = new Handler({
  rekoSvc: reko,
  translatorSvc: trantranslate,
});

export const main = handler.main.bind(handler);
