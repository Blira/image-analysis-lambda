# image-analysis-lambda
A TypeScript lambda function to analyse an image and return the possible contents and the confidence (in %) of the image having this contents in portuguese [pt-BR] in the form of an array of sentences!
This lambda was created exclusively for the propurse of learning.

We could use this image

![parrot](https://statig1.akamaized.net/bancodeimagens/4k/rr/g8/4krrg8sgyv78x2ofctifc72hn.jpg)


To get a result like this: 

```
[
"94.33% de chance de conter Animal",
"94.33% de chance de conter Pássaro",
"94.33% de chance de conter Papagaio",
"81.53% de chance de conter Arara"
]
```

Or this one

![carneiros](https://www.viagenscinematograficas.com.br/wp-content/uploads/2018/12/Praia-dos-Carneiros-Igrejinha-YouTube-2-740x431.jpg)

To get a result like this: 

```
[
"98.91% de chance de conter Terra",
"98.91% de chance de conter Ao ar livre",
"98.91% de chance de conter Natureza",
"98.58% de chance de conter Humano",
"98.58% de chance de conter Pessoa",
"98.18% de chance de conter Água",
"98.04% de chance de conter Oceano",
"98.04% de chance de conter Mar",
"96.78% de chance de conter Verão",
"96.25% de chance de conter Tropical",
"91.54% de chance de conter Costa",
"86.25% de chance de conter Férias"
]
```

# How to run

Running lambda functions with serverless framework is pretty easy! 
Note: You will need [Serverless Framework](https://github.com/serverless/serverless) installed! 

Clone de repository 
```
git clone https://github.com/Blira/image-analysis-lambda.git
```
Download dependencies
```
yarn or npm
```

You can already try it out locally! 
```
sls invoke local -f analyseImage --path request.json 
```

If you want to deploy this lambda on your AWS account just use
```
sls deploy
```

To invoke this lambda remotely use
```
sls invoke -f analyseImage --path request.json
```

