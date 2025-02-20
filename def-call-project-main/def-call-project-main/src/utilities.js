//Made the Utilities for Drawing Bounding Box.
export const drawRect = (
  boxes,
  classes,
  scores,
  threshold,
  imgWidth,
  imgHeight,
  ctx
) => {
  // Label map for signs
  const labelMap = {
    1: {
      name: "Hello",
      color: "red",
    },
    2: {
      name: "Yes",
      color: "yellow",
    },
    3: {
      name: "No",
      color: "lime",
    },
    4: {
      name: "I Love You",
      color: "blue",
    },
    5: {
      name: "Thank You",
      color: "purple",
    },
    6: {
      name: "Name",
      color: "violet",
    },
    7: {
      name: "My",
      color: "green",
    },
  };

  // Displaying the labels on screen
  for (let i = 0; i <= boxes.length; i++) {
    if (scores[i] > threshold) {
      const [y, x, height, width] = boxes[i];
      const text = classes[i];
      ctx.fillStyle = labelMap[text]["color"];
      ctx.font = "30px Arial";
      ctx.strokeRect(x, y, width, height);
      ctx.beginPath();
      ctx.fillText(
        labelMap[text]["name"] + " - " + Math.round(scores[i] * 100) / 100,
        x * imgWidth,
        y * imgHeight - 10
      );
      ctx.clearRect(
        x * imgWidth,
        y * imgHeight,
        (width * imgWidth) / 2,
        (height * imgHeight) / 1.5
      );
      ctx.stroke();
    }
  }
};
