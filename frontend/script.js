// ✅ UPDATED script.js

let moodChart;
let journalEntries = [];

function startListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Speech Recognition not supported in this browser.');
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('journal').value += transcript + ' ';
  };

  recognition.onerror = function (event) {
    alert('Error occurred in speech recognition: ' + event.error);
  };

  recognition.start();
}

function analyzeMood() {
  const journalBox = document.getElementById('journal');
  const text = document.getElementById('journal').value.toLowerCase();
  let mood = 'Neutral';
  let suggestion = '';

  if (text.includes('happy') || text.includes('joy') || text.includes('excited')) {
    mood = 'Positive';
    suggestion = 'Keep doing what makes you happy! Consider sharing this joy with someone close.';
  } else if (text.includes('sad') || text.includes('angry') || text.includes('upset')) {
    mood = 'Negative';
    suggestion = 'Take a break, go for a walk, or talk to a friend. It’s okay to feel down sometimes.';
  } else {
    suggestion = 'Reflect on your day. Journaling regularly might help uncover hidden feelings.';
  }

  const resultBox = document.getElementById('result');
  resultBox.innerHTML = `<strong>Detected Mood:</strong> ${mood}<br><em>${suggestion}</em>`;

  addToChart(mood);
  journalBox.value = '';
}

function saveEntry() {
  const text = document.getElementById('journal').value;
  const mood = document.getElementById('result').innerText.split(': ')[1]?.split('\n')[0] || 'Neutral';
  const date = new Date().toLocaleDateString();

  const entry = { text, mood, date };
  journalEntries.push(entry);
  displayEntries();
}

function displayEntries() {
  const history = document.getElementById('history');
  history.innerHTML = '';

  journalEntries.forEach((entry, index) => {
    const div = document.createElement('div');
    div.innerHTML = `<p><strong>Day ${index + 1} (${entry.date}):</strong> ${entry.mood}<br>${entry.text}</p>`;
    div.style.marginBottom = '1rem';
    history.appendChild(div);
  });
}

function addToChart(mood) {
  const moodValue = mood === 'Positive' ? 1 : mood === 'Negative' ? -1 : 0;

  if (!moodChart) {
    const ctx = document.getElementById('moodChart').getContext('2d');
    moodChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Entry 1'],
        datasets: [
          {
            label: 'Mood Over Time',
            data: [moodValue],
            fill: false,
            borderColor: 'blue',
            tension: 0.3
          }
        ]
      },
      options: {
        scales: {
          y: {
            min: -1,
            max: 1,
            ticks: {
              callback: function (value) {
                return value === 1 ? 'Positive' : value === -1 ? 'Negative' : 'Neutral';
              }
            }
          }
        }
      }
    });
  } else {
    const label = `Entry ${moodChart.data.labels.length + 1}`;
    moodChart.data.labels.push(label);
    moodChart.data.datasets[0].data.push(moodValue);
    moodChart.update();
  }
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(12);

  journalEntries.forEach((entry, i) => {
    const y = 10 + i * 30;
    doc.text(`Day ${i + 1} (${entry.date}) - Mood: ${entry.mood}`, 10, y);
    doc.text(entry.text, 10, y + 10);
  });

  doc.save('MoodJournal.pdf');
}



  