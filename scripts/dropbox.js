// Register module settings with a guide
Hooks.once('init', () => {
  game.settings.register('dropboxer', 'dropboxAppKey', {
    name: 'Dropbox App Key',
    hint: `To create a Dropbox App Key:
1. Visit the Dropbox App Console at dropbox.com/developers/apps and create a new app.
2. Choose "Scoped access" and select "Full Dropbox" or "App Folder".
3. Enable the following permissions: files.content.read, files.content.write, sharing.read.
4. Add your Foundry VTT domain (e.g., test.uber.space) under "Chooser/Saver" and "Embedder" domains.
5. Copy the App Key and paste it here.`,
    scope: 'world',
    config: true,
    type: String,
    default: '', // Ensure users input their key
  });
});

// Use the changeSidebarTab hook to add the Dropbox button only when the "Scenes" tab is active
Hooks.on('changeSidebarTab', async (app) => {
  // Check if the tab is "scenes"
  if (app.tabName !== 'scenes') return;

  // Get the Dropbox App Key from settings
  const appKey = game.settings.get('dropboxer', 'dropboxAppKey');
  if (!appKey) {
    ui.notifications.error('Dropbox App Key not set. Please configure it in the module settings.');
    return;
  }

  // Load the Dropbox Chooser SDK if not already loaded
  if (!document.getElementById('dropboxjs')) {
    const script = document.createElement('script');
    script.src = "https://www.dropbox.com/static/api/2/dropins.js";
    script.id = "dropboxjs";
    script.setAttribute('data-app-key', appKey);
    document.head.appendChild(script);

    script.onload = () => {
      console.log("Dropbox SDK loaded.");
      injectDropboxButton(app);
    };
  } else {
    injectDropboxButton(app);
  }
});

// Add the Dropbox button to file pickers in other applications
Hooks.on('renderApplication', (app, html) => {
  const appKey = game.settings.get('dropboxer', 'dropboxAppKey');
  if (!appKey) {
    ui.notifications.error('Dropbox App Key not set. Please configure it in the module settings.');
    return;
  }

  injectDropboxButtons2(html);
});

// Function to inject Dropbox buttons next to file pickers
function injectDropboxButtons2(html) {
  // Select all file pickers in the rendered form
  const filePickers = html.find('button.file-picker[data-type="imagevideo"]');

  filePickers.each((index, picker) => {
    const dropboxButton = $(`<button type="button" class="dropbox-file-picker" title="Choose from Dropbox" tabindex="-1">
      <i class="fab fa-dropbox"></i>
    </button>`);

    // Insert the Dropbox button next to the file picker
    $(picker).after(dropboxButton);

    // Add the click event to open Dropbox Chooser
    dropboxButton.on('click', (event) => openDropboxChooser2(event, picker));
  });
}

// Function to open the Dropbox Chooser and set the selected file's URL to the input field
function openDropboxChooser2(event, picker) {
  const appKey = game.settings.get('dropboxer', 'dropboxAppKey');
  if (!appKey) {
    ui.notifications.error('Dropbox App Key not set. Please configure it in the module settings.');
    return;
  }

  const options = {
    success: async function(files) {
      const directLink = files[0].link;
      const inputField = $(picker).closest('.form-group').find('input[type="text"]');
      inputField.val(directLink);
    },
    cancel: function() {
      console.log('User canceled the chooser.');
    },
    linkType: "direct",
    multiselect: false,
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  };

  Dropbox.choose(options);
}

// Function to inject the Dropbox Chooser button on the "Scenes" tab
function injectDropboxButton(app) {
  const createSceneButton = app.element.find('button.create-document.create-entry');
  if (createSceneButton.length) {
    const dropboxButton = $(`<button class="dropbox-chooser"><i class="fab fa-dropbox"></i> Choose from Dropbox</button>`);
    dropboxButton.on('click', openDropboxChooser);

    // Insert the button after the "Create Scene" button
    createSceneButton.after(dropboxButton);
  }
}

// Function to open the Dropbox Chooser for creating a scene
function openDropboxChooser() {
  const appKey = game.settings.get('dropboxer', 'dropboxAppKey');
  if (!appKey) {
    ui.notifications.error('Dropbox App Key not set. Please configure it in the module settings.');
    return;
  }

  const options = {
    success: async function(files) {
      const directLink = files[0].link;
      const dimensions = await getDimensionsFromImage(directLink);
      createSceneWithBackground(files[0].name, directLink, dimensions.width, dimensions.height);
    },
    cancel: function() {
      console.log('User canceled the chooser.');
    },
    linkType: "direct",
    multiselect: false,
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  };

  Dropbox.choose(options);
}

// Function to get dimensions from an image URL
function getDimensionsFromImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function() {
      resolve({ width: this.width, height: this.height });
    };
    img.src = url;
  });
}

// Function to create a scene in Foundry VTT using the selected file
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