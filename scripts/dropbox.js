// Helper function to transform a Dropbox preview link into a direct link
function transformToDirectLink(previewLink) {
  return previewLink.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '');
}

// Register module settings
Hooks.once('init', () => {
  game.settings.register('dropboxer', 'dropboxAppKey', {
    name: 'Dropbox App Key',
    hint: `
      Enter your Dropbox App Key here. 
      <br> 
      <strong>How to Create an App Key:</strong> 
      <ol>
        <li>Visit the Dropbox Developers page and create a new app.</li>
        <li>Choose "Scoped access" and then "Full Dropbox" access.</li>
        <li>Under "Permissions," enable "files.content.read" and "sharing.read."</li>
        <li>Under "OAuth 2," add your domain to the "Redirect URIs" section.</li>
        <li>Save your app and copy the App Key into this field.</li>
      </ol>
      <strong>Suggested Chooser/Saver/Embedder Domains:</strong> 
      <br>Use the main domain of your Foundry VTT installation.
    `,
    scope: 'world',
    config: true,
    type: String,
    default: '',
  });
});

// Add the Dropbox button to the sidebar when it is rendered
Hooks.on('renderSidebarTab', async (app, html) => {
  const appKey = game.settings.get('dropboxer', 'dropboxAppKey');
  if (!appKey) {
    ui.notifications.error('Dropbox App Key not set. Please configure it in the module settings.');
    return;
  }

  if (!document.getElementById('dropboxjs')) {
    const script = document.createElement('script');
    script.src = "https://www.dropbox.com/static/api/2/dropins.js";
    script.id = "dropboxjs";
    script.setAttribute('data-app-key', appKey);
    document.head.appendChild(script);

    script.onload = () => {
      console.log("Dropbox SDK loaded.");
      injectDropboxButton(html);
    };
  } else {
    injectDropboxButton(html);
  }
});

// Add the Dropbox button to TileConfig when it is rendered
Hooks.on('renderTileConfig', (app, html) => {
  injectDropboxButtonToTileConfig(html);
});

// Add the Dropbox button to FilePicker when it is rendered
Hooks.on('renderFilePicker', (app, html) => {
  const appKey = game.settings.get('dropboxer', 'dropboxAppKey');
  if (!appKey) {
    ui.notifications.error('Dropbox App Key not set. Please configure it in the module settings.');
    return;
  }

  injectDropboxButtonToFilePicker(html, app);
});

// Function to inject Dropbox buttons in TileConfig windows
function injectDropboxButtonToTileConfig(html) {
  const filePicker = html.find('button.file-picker[data-type="imagevideo"]');

  if (filePicker.length && !html.find('.dropbox-file-picker').length) {
    const dropboxButton = $(`<button type="button" class="dropbox-file-picker" title="Choose from Dropbox" tabindex="-1">
      <i class="fab fa-dropbox"></i>
    </button>`);

    filePicker.before(dropboxButton);

    dropboxButton.on('click', (event) => {
      openDropboxChooserForTileConfig(event, html.find('input[name="texture.src"]'));
    });
  }
}

// Function to inject Dropbox buttons in FilePicker windows
function injectDropboxButtonToFilePicker(html, app) {
  // Select the input field where the URL of the selected file appears
  const fileInput = html.find('input[type="text"][name="file"]');

  // Ensure that the Dropbox button is only injected once
  if (fileInput.length && !html.find('.dropbox-file-picker').length) {
    const dropboxButton = $(`<button type="button" class="dropbox-file-picker" title="Choose from Dropbox" tabindex="-1">
      <i class="fab fa-dropbox"></i>
    </button>`);

    // Inject the Dropbox button before the file picker input field
    fileInput.before(dropboxButton);

    // Attach the click event to open Dropbox Chooser
    dropboxButton.on('click', (event) => {
      openDropboxChooserForFilePicker(event, fileInput);
    });
  }
}

// Function to open Dropbox Chooser for FilePicker
function openDropboxChooserForFilePicker(event, inputField) {
  const appKey = game.settings.get('dropboxer', 'dropboxAppKey');
  if (!appKey) {
    ui.notifications.error('Dropbox App Key not set. Please configure it in the module settings.');
    return;
  }

  const options = {
    success: function(files) {
      const previewLink = files[0].link;
      const directLink = transformToDirectLink(previewLink);
      console.log('Preview Link:', previewLink);
      console.log('Direct Link:', directLink);
      inputField.val(directLink);
    },
    cancel: function() {
      console.log('User canceled the chooser.');
    },
    linkType: "preview", // Use "preview" to get the preview link first
    multiselect: false,
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  };

  Dropbox.choose(options);
}

// Function to open Dropbox Chooser for TileConfig
function openDropboxChooserForTileConfig(event, inputField) {
  const appKey = game.settings.get('dropboxer', 'dropboxAppKey');
  if (!appKey) {
    ui.notifications.error('Dropbox App Key not set. Please configure it in the module settings.');
    return;
  }

  const options = {
    success: function(files) {
      const previewLink = files[0].link;
      const directLink = transformToDirectLink(previewLink);
      console.log('Preview Link:', previewLink);
      console.log('Direct Link:', directLink);
      inputField.val(directLink);
    },
    cancel: function() {
      console.log('User canceled the chooser.');
    },
    linkType: "preview", // Use "preview" to get the preview link first
    multiselect: false,
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  };

  Dropbox.choose(options);
}

// Function to open Dropbox Chooser for scene creation
function openDropboxChooserForScene() {
  const appKey = game.settings.get('dropboxer', 'dropboxAppKey');
  if (!appKey) {
    ui.notifications.error('Dropbox App Key not set. Please configure it in the module settings.');
    return;
  }

  const options = {
    success: async function(files) {
      const previewLink = files[0].link;
      const directLink = transformToDirectLink(previewLink);
      const fileName = files[0].name;
      console.log('Preview Link:', previewLink);
      console.log('Direct Link:', directLink);
      console.log('File Name:', fileName);

      const dimensions = await getDimensionsFromImage(directLink);
      console.log('Image Dimensions:', dimensions.width + 'x' + dimensions.height);

      // Proceed with creating the scene
      createSceneWithBackground(fileName, directLink, dimensions.width, dimensions.height);
    },
    cancel: function() {
      console.log('User canceled the chooser.');
    },
    linkType: "preview", // Use "preview" to get the preview link first
    multiselect: false,
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  };

  Dropbox.choose(options);
}

async function createSceneWithBackground(sceneName, backgroundUrl, width, height) {
  try {
    if (!width || !height) {
      const dimensions = await getDimensionsFromImage(backgroundUrl);
      width = dimensions.width;
      height = dimensions.height;
    }

    const newScene = await Scene.create({
      name: sceneName,
      img: backgroundUrl,
      width: width,
      height: height,
      grid: 100,
    });

    ui.notifications.info(`Scene "${newScene.name}" created with background: ${backgroundUrl}`);
  } catch (error) {
    console.error("Failed to create scene:", error);
    ui.notifications.error("Failed to create scene. Please check the console for details.");
  }
}

function getDimensionsFromImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function() {
      resolve({ width: this.width, height: this.height });
    };
    img.src = url;
  });
}
// Function to open the Dropbox Chooser for audio files and set the selected file's URL
function openDropboxChooserForAudio(event, picker) {
  event.preventDefault(); // Prevent default behavior which might close the window

  const appKey = game.settings.get('dropboxer', 'dropboxAppKey');
  if (!appKey) {
    ui.notifications.error('Dropbox App Key not set. Please configure it in the module settings.');
    return;
  }

  const options = {
    success: async function(files) {
      const previewLink = files[0].link;
      const directLink = transformToDirectLink(previewLink);
      console.log('Preview Link:', previewLink);
      console.log('Direct Link:', directLink);
      const inputField = $(picker).closest('.form-fields').find('input[type="text"]');
      inputField.val(directLink);
    },
    cancel: function() {
      console.log('User canceled the chooser.');
    },
    linkType: "preview",  // Use "preview" to get the preview link first
    multiselect: false,
    extensions: ['.mp3', '.ogg', '.wav'], // Allow only audio files
  };

  // Open the Dropbox Chooser in a way that doesn't cause the parent window to lose focus
  Dropbox.choose(options);
}

// Function to open the Dropbox Chooser for folder selection
function openDropboxChooserForFolder(event, html) {
  const appKey = game.settings.get('dropboxer', 'dropboxAppKey');
  if (!appKey) {
    ui.notifications.error('Dropbox App Key not set. Please configure it in the module settings.');
    return;
  }

  const options = {
    success: function(files) {
      files.forEach(file => {
        const previewLink = file.link;
        const directLink = transformToDirectLink(previewLink);
        console.log('Preview Link:', previewLink);
        console.log('Direct Link:', directLink);
      });
      // Now populate the playlist with these files
      addTracksToPlaylist(html, files);
    },
    cancel: function() {
      console.log('User canceled the chooser.');
    },
    linkType: "preview",  // Use "preview" to get the preview link first
    folderselect: false, // Don't allow folder selection, just files
    multiselect: true,   // Allow multiple file selection
    extensions: ['.mp3', '.wav', '.ogg']  // Audio file types
  };

  Dropbox.choose(options);
}

// Function to add tracks to the playlist
async function addTracksToPlaylist(html, files) {
  // Extract the playlist ID from the main div
  const playlistId = html.closest('.app.window-app.sheet').attr('id').split('-').pop();
  console.log('Playlist ID:', playlistId);

  // Get the playlist object using Foundry VTT API
  const playlist = game.playlists.get(playlistId);
  if (!playlist) {
    ui.notifications.error('Playlist not found.');
    return;
  }

  // Add each selected file as a new sound in the playlist
  for (const file of files) {
    try {
      const previewLink = file.link;
      const directLink = transformToDirectLink(previewLink);
      const soundData = {
        name: file.name,
        path: directLink,
        playing: false,  // Default to not playing
        repeat: false,   // Default to not repeating
        volume: 0.5      // Default volume
      };
      await playlist.createEmbeddedDocuments('PlaylistSound', [soundData]);
      console.log(`Added ${file.name} to the playlist with link: ${directLink}`);
    } catch (error) {
      console.error('Failed to add track:', error);
      ui.notifications.error(`Failed to add ${file.name} to the playlist.`);
    }
  }

  ui.notifications.info('Tracks added to the playlist successfully.');
}

// Hook to render the Playlist Config and inject the Dropbox button
Hooks.on('renderPlaylistConfig', (app, html) => {
  injectDropboxButtonForPlaylistConfig(html);
});

// Function to inject Dropbox button into Playlist Config
function injectDropboxButtonForPlaylistConfig(html) {
  const filePickerButton = html.find('button.file-picker[data-type="folder"]');
  if (filePickerButton.length) {
    const dropboxButton = $(`<button class="dropbox-folder-picker" title="Choose from Dropbox" tabindex="-1">
      <i class="fab fa-dropbox"></i>
    </button>`);
    
    // Insert the Dropbox button before the file picker button
    filePickerButton.before(dropboxButton);

    // Add click event to open Dropbox Chooser
    dropboxButton.on('click', (event) => openDropboxChooserForFolder(event, html));
  }
}

// Function to inject the Dropbox Chooser button for scene creation in the sidebar
function injectDropboxButton(html) {
  const createSceneButton = html.find('button.create-document.create-entry');
  if (createSceneButton.length && html.closest('#scenes').length) {
    if (!createSceneButton.next('.dropbox-chooser').length) {
      const dropboxButton = $(`<button class="dropbox-chooser"><i class="fab fa-dropbox"></i> Choose from Dropbox</button>`);
      dropboxButton.on('click', openDropboxChooserForScene);
      createSceneButton.after(dropboxButton);
    }
  }
}

// Function to load the Dropbox SDK
function loadDropboxSDK(appKey) {
  if (!document.getElementById('dropboxjs')) {
    const script = document.createElement('script');
    script.src = "https://www.dropbox.com/static/api/2/dropins.js";
    script.id = "dropboxjs";
    script.setAttribute('data-app-key', appKey);
    document.head.appendChild(script);

    script.onload = () => {
      console.log("Dropbox SDK loaded.");
    };
  }
}

// Ensure that Dropbox SDK is loaded at the start
Hooks.once('init', () => {
  const appKey = game.settings.get('dropboxer', 'dropboxAppKey');
  loadDropboxSDK(appKey);
});
