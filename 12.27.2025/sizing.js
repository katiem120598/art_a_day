function resizeImage() {
  // same logic as your canvas
  let dimx = Math.min(window.innerHeight - 300, window.innerWidth - 300);
  if (dimx < 0) dimx = 0; // safety

  const img = document.getElementById('day5-img');
  if (!img) return;

  img.style.width  = dimx + 'px';
  img.style.height = dimx + 'px'; // remove this line if you’d rather keep aspect ratio
}

// run once on load
window.addEventListener('load', resizeImage);
// run again whenever window size changes
window.addEventListener('resize', resizeImage);
