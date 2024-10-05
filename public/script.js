const apiList = [
  { name: 'Youtube', path: '/misc/youtube?q=lelena&apikey=', id: 'yt', description: 'Search for YouTube videos using a keyword.', type: 'free' },
  { name: 'Color Search', path: '/misc/color?colorCode=#fffff&apikey=', id: 'colors', description: 'Search color details by color code', type: 'free' },
  { name: 'unforgivable', path: '/misc/unforgivable?text=hello&apikey=', id: 'unforgivable', description: 'Generate an unforgivable meme.', type: 'free' },
  { name: 'alert', path: '/misc/alert?text=hello&apikey=', id: 'alert', description: 'Generate an alert meme.', type: 'free' },
  { name: 'Encode', path: '/misc/encode?text=hello&apikey=', id: 'encode', description: 'Encode your text to binary', type: 'free' },
  { name: 'Decode', path: '/misc/decode?text=hello&apikey=', id: 'decode', description: 'Decode binary to text', type: 'free' },
  { name: 'APK Finder', path: '/misc/apk?apkName=whatsapp&apikey=', id: 'apk', description: 'Download the latest WhatsApp APK.', type: 'free' },
  { name: 'YTs Mx', path: '/misc/ytsmx?search=avatar&apikey=', id: 'yts', description: 'Search for yts.mx using a keyword.', type: 'free' },
  { name: 'Steam Game Finder', path: '/misc/steam?search=dead&apikey=', id: 'steam', description: 'Search Game From Steam', type: 'free' },
  { name: 'BING Search', path: '/misc/bing?query=blackpink&apikey=', id: 'bing', description: 'Search for results on Bing.', type: 'free' },
  { name: 'Astronomy Picture of the Day (APOD)', path: '/misc/apod?apikey=', id: 'apod', description: 'Get NASA\'s Astronomy Picture of the Day.', type: 'free' },
  { name: 'Random Cocktail', path: '/misc/cocktailrandom?apikey=', id: 'cocktail', description: 'Fetch information about a random cocktail.', type: 'free' },
  { name: 'Location Info', path: '/misc/location/:ipAddress?apikey=', id: 'location', description: 'Get location information based on an IP address.', type: 'free' },
  { name: 'Threads', path: '/misc/thread?url=https://www.threads.net/@momojypx/post/C52-OaTL3al&apikey=', id: 'threads', description: 'Fetch information about a Threads post.', type: 'free' },
  { name: 'Tiktok', path: '/misc/tiktok?url=https://vm.tiktok.com/ZMhNNeDHU/&apikey=', id: 'tiktok', description: 'Get details about a TikTok video.', type: 'free' },
  { name: 'Sporty News', path: '/misc/sportynews?apikey=', id: 'sport', description: 'Fetch the latest sports news.', type: 'free' },
  { name: 'Derana News', path: '/misc/derananews?apikey=', id: 'dera', description: 'Get news from Derana.', type: 'free' },
  { name: 'iOS News', path: '/misc/iosnews?apikey=', id: 'iosnews', description: 'Fetch the latest iOS-related news.', type: 'free' },
  { name: 'Esana News', path: '/misc/esana?apikey=', id: 'esana', description: 'Get news from Esana.', type: 'free' },
  { name: 'Cric', path: '/misc/cric?apikey=', id: 'cric', description: 'Fetch cricket-related information.', type: 'free' },
  { name: 'ISS', path: '/misc/iss?apikey=', id: 'iss', description: 'Get current information about the International Space Station.', type: 'free' },
  { name: 'ChatGPT', path: '/misc/chatgpt?q=hello&apikey=', id: 'chatgpt', description: 'Interact with ChatGPT AI.', type: 'paid' },
];

let totalRequests = 0;
let availableApis = 0;
let unavailableApis = 0;
let totalResponseTime = 0;

function createApiCard(api) {
  return `
      <div class="api-card" id="${api.id}-card">
          <div class="api-header" onclick="toggleApiContent('${api.id}')">
              <span class="api-name">${api.name}</span>
              <span class="api-type ${api.type}">${api.type}</span>
              <span class="api-status checking" id="${api.id}-status">Checking...</span>
          </div>
          <div class="api-content" id="${api.id}-content">
              <div class="api-description">${api.description}</div>
              <div class="api-path">${api.path}</div>
              <button class="copy-btn" onclick="copyApiPath('${api.path}')">Copy Path</button>
              <button class="test-btn" onclick="testApi('${api.id}')">Test API</button>
              <div class="api-result" id="${api.id}-result"></div>
          </div>
      </div>
  `;
}

function renderApiList() {
  const apiListElement = document.getElementById('api-list');
  apiListElement.innerHTML = apiList.map(createApiCard).join('');
}

function toggleApiContent(apiId) {
  const content = document.getElementById(`${apiId}-content`);
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

function copyApiPath(path) {
  navigator.clipboard.writeText(path + 'your_api_key_here')
      .then(() => showAlert('Copied to clipboard: ' + path + 'your_api_key_here'))
      .catch(err => showAlert('Failed to copy: ' + err));
}

function showAlert(message) {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  alert.style.display = 'block';
  setTimeout(() => {
      alert.style.opacity = '0';
      setTimeout(() => {
          alert.style.display = 'none';
          alert.style.opacity = '1';
      }, 500);
  }, 3000);
}

async function testApi(apiId) {
  const api = apiList.find(a => a.id === apiId);
  if (!api) return;

  const statusElement = document.getElementById(`${apiId}-status`);
  const resultElement = document.getElementById(`${apiId}-result`);

  statusElement.textContent = 'Testing...';
  statusElement.classList.remove('available', 'unavailable');
  statusElement.classList.add('checking');

  try {
      const startTime = performance.now();
      const response = await fetch(api.path + 'your_api_key_here');
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      if (response.ok) {
          statusElement.textContent = 'Available';
          statusElement.classList.remove('checking', 'unavailable');
          statusElement.classList.add('available');

          const data = await response.json();
          resultElement.textContent = JSON.stringify(data, null, 2);
          showAlert(`API test successful. Response time: ${Math.round(responseTime)}ms`);
      } else {
          statusElement.textContent = 'Unavailable';
          statusElement.classList.remove('checking', 'available');
          statusElement.classList.add('unavailable');

          resultElement.textContent = 'Error: ' + response.status + ' ' + response.statusText;
          showAlert(`API test failed. Status: ${response.status} ${response.statusText}`);
      }

      updateMonitorBoard(responseTime);
  } catch (error) {
      statusElement.textContent = 'Error';
      statusElement.classList.remove('checking', 'available');
      statusElement.classList.add('unavailable');

      resultElement.textContent = 'Error: ' + error.message;
      showAlert(`API test failed. Error: ${error.message}`);

      updateMonitorBoard();
  }
}

function updateMonitorBoard(responseTime = 0) {
  totalRequests++;
  totalResponseTime += responseTime;

  document.getElementById('total-requests').textContent = totalRequests;
  document.getElementById('available-apis').textContent = availableApis;
  document.getElementById('unavailable-apis').textContent = unavailableApis;
  const avgResponseTime = totalRequests > 0 ? Math.round(totalResponseTime / totalRequests) : 0;
  document.getElementById('average-response-time').textContent = `${avgResponseTime} ms`;

  document.querySelectorAll('.monitor-value').forEach(el => {
      el.style.animation = 'pulse 0.5s';
      setTimeout(() => el.style.animation = '', 500);
  });
}

function hideLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  loadingScreen.style.opacity = '0';
  setTimeout(() => {
      loadingScreen.style.display = 'none';
  }, 500);
}

function showLoadingScreen() {
  const loadingScreen = document.querySelector('.loading-screen');
  loadingScreen.style.display = 'flex';
  loadingScreen.style.opacity = '1';
}

async function initializeApp() {
  showLoadingScreen();
  renderApiList();

  const totalApis = apiList.length;
  const loadingProgress = document.getElementById('loading-progress');
  const loadingPercentage = document.getElementById('loading-percentage');

  for (let i = 0; i < apiList.length; i++) {
      const api = apiList[i];
      await checkApiStatus(api);

      const progress = ((i + 1) / totalApis) * 100;
      loadingProgress.style.width = `${progress}%`;
      loadingPercentage.textContent = `${Math.round(progress)}%`;
  }

  setTimeout(hideLoadingScreen, 1000);
}

async function checkApiStatus(api) {
  try {
      const startTime = performance.now();
      const response = await fetch(api.path + 'your_api_key_here');
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      const statusElement = document.getElementById(`${api.id}-status`);

      if (response.ok) {
          statusElement.textContent = 'Available';
          statusElement.classList.remove('checking', 'unavailable');
          statusElement.classList.add('available');
          availableApis++;
      } else {
          statusElement.textContent = 'Unavailable';
          statusElement.classList.remove('checking', 'available');
          statusElement.classList.add('unavailable');
          unavailableApis++;
      }

      totalRequests++;
      totalResponseTime += responseTime;
      updateMonitorBoard();
  } catch (error) {
      const statusElement = document.getElementById(`${api.id}-status`);
      statusElement.textContent = 'Error';
      statusElement.classList.remove('checking', 'available');
      statusElement.classList.add('unavailable');
      unavailableApis++;

      totalRequests++;
      updateMonitorBoard();
  }
}

window.onload = initializeApp;

// Add this function to enable/disable dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// Filter APIs
function filterApis(type) {
  const apiCards = document.querySelectorAll('.api-card');
  apiCards.forEach(card => {
      if (type === 'all' || card.querySelector(`.api-type.${type}`)) {
          card.style.display = 'block';
      } else {
          card.style.display = 'none';
      }
  });
}

// Search APIs
function searchApis() {
  const searchInput = document.getElementById('api-search').value.toLowerCase();
  const apiCards = document.querySelectorAll('.api-card');
  apiCards.forEach(card => {
      const apiName = card.querySelector('.api-name').textContent.toLowerCase();
      const apiDescription = card.querySelector('.api-description').textContent.toLowerCase();
      if (apiName.includes(searchInput) || apiDescription.includes(searchInput)) {
          card.style.display = 'block';
      } else {
          card.style.display = 'none';
      }
  });
}