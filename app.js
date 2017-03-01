// Using https://algorithmia.com/algorithms/opencv/FaceDetection
const client = require("algorithmia").client(process.env.ALGORITHMIA_TOKEN);
const imageUrl = process.argv[2];

if (!imageUrl)
  throw new Error('Image url is missing');

const input = [
    imageUrl,
    "data://.algo/temp/result.jpg"
];

// execute and get result file path
client.algo("algo://opencv/FaceDetection/0.1.8")
  .pipe(input)
  .then(response => {
    var file_path = response.get().replace("/.algo/", "/.algo/opencv/ObjectDetectionWithModels/");
    var meta_file_path = file_path.replace(".jpg",".jpgrects.txt");

    client.file(meta_file_path).exists(function(exists) {
        if (exists == true) {
            // Download contents of file as a string if it exists
            client.file(meta_file_path).get(function(err, data) {
                if (err) {
                    console.err("Failed to download file.");
                    throw err;
                } else {
                    const facesCount = data.split("\n").length - 1;
                    console.log(`Detected ${facesCount} face(s)`);
                    return facesCount;
                }
            });
        } else {
            throw new Error(`${meta_file_path} file doesn't exist`);
        }
    });
});
