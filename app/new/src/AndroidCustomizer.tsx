import React, { useState } from 'react';
import './AndroidCustomizer.css';

const wallpapers = [
  'https://via.placeholder.com/120x80/4f46e5/fff?text=Blue',
  'https://via.placeholder.com/120x80/16a34a/fff?text=Green',
  'https://via.placeholder.com/120x80/f59e42/fff?text=Orange',
  'https://via.placeholder.com/120x80/ef4444/fff?text=Red'
];

const themes = ['Light', 'Dark', 'Amoled', 'Pastel'];
const screensavers = ['Clock', 'Photo Slideshow', 'Quotes', 'None'];
const fonts = ['Roboto', 'Lobster', 'Montserrat', 'Dancing Script'];

function AndroidCustomizer() {
  const [selectedWallpaper, setSelectedWallpaper] = useState(wallpapers[0]);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [selectedScreensaver, setSelectedScreensaver] = useState(screensavers[0]);
  const [selectedFont, setSelectedFont] = useState(fonts[0]);

  return (
    <div className="android-customizer">
      <h2>Android Phone Customizer</h2>
      <div className="custom-section">
        <label>Wallpaper:</label>
        <div className="wallpaper-list">
          {wallpapers.map((url, idx) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={idx}
              src={url}
              alt={`Wallpaper ${idx+1}`}
              className={selectedWallpaper === url ? 'selected' : ''}
              onClick={() => setSelectedWallpaper(url)}
            />
          ))}
        </div>
      </div>
      <div className="custom-section">
        <label>Theme:</label>
        <select value={selectedTheme} onChange={e => setSelectedTheme(e.target.value)}>
          {themes.map(theme => (
            <option key={theme} value={theme}>{theme}</option>
          ))}
        </select>
      </div>
      <div className="custom-section">
        <label>Screensaver:</label>
        <select value={selectedScreensaver} onChange={e => setSelectedScreensaver(e.target.value)}>
          {screensavers.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="custom-section">
        <label>Font:</label>
        <select value={selectedFont} onChange={e => setSelectedFont(e.target.value)}>
          {fonts.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <div className="preview-section">
        <h3>Preview</h3>
        <div
          className="phone-preview"
          style={{
            backgroundImage: `url(${selectedWallpaper})`,
            fontFamily: selectedFont,
            color: selectedTheme === 'Dark' || selectedTheme === 'Amoled' ? '#fff' : '#222',
            backgroundColor: selectedTheme === 'Amoled' ? '#000' : selectedTheme === 'Dark' ? '#222' : '#fff',
          }}
        >
          <div className="screen-content">
            <div className="screensaver">{selectedScreensaver}</div>
            <div className="theme">Theme: {selectedTheme}</div>
            <div className="font">Font: {selectedFont}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AndroidCustomizer;
