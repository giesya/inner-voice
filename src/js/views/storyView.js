const card = document.createElement('div');
card.classList.add('story-card');
card.innerHTML = `
  <img src="${story.photoUrl}" alt="${story.name}" loading="lazy" />
  <h3>${story.name}</h3>
  <p>${story.description}</p>
`; 