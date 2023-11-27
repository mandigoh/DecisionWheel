const decisionInput = document.getElementById('decision');
const decision = document.getElementById('decision-needed');

decisionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const decisionData = decisionInput.value;
      decision.innerHTML = decisionData;
      decisionInput.disabled = false;
    }
  });

  const wheel = document.getElementById("wheel"),
  spinBtn = document.getElementById("spin-button"),
  finalValue = document.getElementById("final-value"),
  inputValues = document.getElementById("item-list");

let myChart; // Declare myChart variable
let rotationValues; // Declare rotationValues as global variable

// Function to create or update chart
const initializeChart = () => {
  // Parse input values and set data array
  const inputData = inputValues.value.split('\n').map(value => value.trim());

  rotationValues = inputData.map((value, index) => {
    let minDegree, maxDegree;
  
    // Add 1 degree for each index greater than or equal to 1
    if (index >= 1) {
      minDegree = (360 / inputData.length) * index + 1;
      maxDegree = (360 / inputData.length) * (index + 1);
    } else {
      minDegree = (360 / inputData.length) * index;
      maxDegree = (360 / inputData.length) * (index + 1);
    }
  
    return { minDegree, maxDegree, value };
  });
  
  console.log(rotationValues);

  const pieColors = [
    "#1B9989", "#E9EDEE", "#F9C74F", "#126782",
  ];

  // Create a new chart if it doesn't exist
  if (!myChart) {
    myChart = new Chart(wheel, {
        // Display text on chart
        plugins: [ChartDataLabels],
        type: "pie",
        data: {
            labels: inputData,
            datasets: [{
                backgroundColor: pieColors,
                data: Array(inputData.length).fill(1), // Use 1 as a placeholder for text values
              }],
        },
        options: {
            responsive: true,
            animation: { duration: 0 },
            plugins: {
                tooltip: false,
                legend: {
                    display: false,
                  },
                datalabels: {
                    color: "#000000",
                    formatter: (_, context) => context.chart.data.labels[context.dataIndex],
                    font: { size: 16 },
                  },
              },
          },
      });
  } else {
    // Update the existing chart
    myChart.data.labels = inputData;
    myChart.data.datasets[0].backgroundColor = pieColors;
    myChart.data.datasets[0].data = Array(inputData.length).fill(1);
    myChart.update();
  }
};

initializeChart();

// Event listener for automatic updating when input values change
inputValues.addEventListener("input", initializeChart);

// Display value based on randomAngle
const generateValue = (angleValue) => {
  for (let i of rotationValues) {
      if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
          // finalValue.innerHTML = `${i.value}`;
          spinBtn.disabled = false;
          break;
      }
  }
}; 

// Spinner Count
let count = 0;
let resultValue = 101;

// Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  // Generate random degree to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  console.log(randomDegree);
  // Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
      myChart.options.rotation = myChart.options.rotation + resultValue;
      myChart.update();
      // if rotation > 360 reset it back to 0
      if (myChart.options.rotation >= 360) {
          count += 1;
          resultValue -= 5;
          myChart.options.rotation = 0;
      } else if (count > 15 && myChart.options.rotation == randomDegree) {
          //generateValue(randomDegree);
          clearInterval(rotationInterval);
          count = 0;
          resultValue = 101;
      }
  }, 10);
});


