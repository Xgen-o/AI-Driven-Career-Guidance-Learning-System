document.getElementById('predictAndGetCoursesBtn').addEventListener('click', async () => {
    console.log('Predict button clicked');

    const name = document.getElementById('name').value.trim();
    const education = document.getElementById('education').value;
    const skills = document.getElementById('skills').value.split(',').map(skill => skill.trim());
    const interests = document.getElementById('interests').value.split(',').map(interest => interest.trim());

    if (!name || !education || skills.length === 0 || interests.length === 0) {
        alert('Please fill in all fields.');
        return;
    }

    const buttonText = document.getElementById('predictAndGetCoursesBtn').querySelector('span');
    const loadingSpinner = document.createElement('span');
    loadingSpinner.className = 'spinner-border spinner-border-sm';
    loadingSpinner.role = 'status';
    loadingSpinner.setAttribute('aria-hidden', 'true');

    document.getElementById('predictAndGetCoursesBtn').innerHTML = '';
    document.getElementById('predictAndGetCoursesBtn').appendChild(loadingSpinner);
    document.getElementById('predictAndGetCoursesBtn').disabled = true;

    try {
        // Fetch career predictions
        const careerResponse = await fetch('/api/career-predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, education, skills, interests })
        });

        if (!careerResponse.ok) {
            throw new Error('Failed to fetch career prediction.');
        }

        const careerData = await careerResponse.json();
        const predictionList = document.getElementById('predictionList');
        predictionList.innerHTML = '';
        careerData.prediction.split('\n').filter(Boolean).forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.trim();
            li.className = 'list-group-item';
            predictionList.appendChild(li);
        });

        // Fetch YouTube videos
        const videoQuery = `${skills.join(' ')} ${interests.join(' ')} tutorial`;
        const videoResponse = await fetch(`/api/youtube-videos?query=${encodeURIComponent(videoQuery)}`);

        if (!videoResponse.ok) {
            throw new Error('Failed to fetch YouTube videos.');
        }

        const videos = await videoResponse.json();
        const videoList = document.getElementById('videoList');
        videoList.innerHTML = '';
        videos.forEach(video => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank" class="list-group-item">${video.snippet.title}</a>`;
            videoList.appendChild(li);
        });

        // Fetch course recommendations
        const courseResponse = await fetch('/api/course-recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ skills, interests })
        });

        if (!courseResponse.ok) {
            throw new Error('Failed to fetch course recommendations.');
        }

        const courseData = await courseResponse.json();
        const courseList = document.getElementById('courseList');
        courseList.innerHTML = '';
        courseData.recommendations.split('\n').filter(Boolean).forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.trim();
            li.className = 'list-group-item';
            courseList.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
        const predictionList = document.getElementById('predictionList');
        predictionList.innerHTML = '<li class="list-group-item">An error occurred. Please try again.</li>';
    } finally {
        document.getElementById('predictAndGetCoursesBtn').innerHTML = 'Predict Career & Get Courses';
        document.getElementById('predictAndGetCoursesBtn').disabled = false;
    }
});

document.getElementById('sortButton').addEventListener('click', function() {
    const predictionList = document.getElementById('predictionList');
    Array.from(predictionList.children)
        .sort((a, b) => a.textContent.localeCompare(b.textContent))
        .forEach(li => predictionList.appendChild(li));
});

document.getElementById('filterButton').addEventListener('click', function() {
    const filterPreferences = document.getElementById('filterPreferences').value;
    const predictionList = document.getElementById('predictionList');
    const items = Array.from(predictionList.children);

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (filterPreferences === 'all' || text.includes(filterPreferences)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});

// Function to print the prediction
function printPrediction() {
    window.print();
}

// Event listener for print button
document.getElementById('print-btn').addEventListener('click', printPrediction);
