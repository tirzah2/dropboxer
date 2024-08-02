
Hi! 
This is DMkal! If you like my little modules, please offer me a coffee, I would appreciate that a lot and motivate me to do many more modules and quality of life tools! Thank you very much!
<br>
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/D1D210UKH9)  


https://github.com/user-attachments/assets/19b06d17-85ff-4573-a8dc-b1bfd7183530


<h1>Dropboxer Module for Foundry VTT</h1>
<h2>Overview</h2>
<p><strong>Dropboxer</strong> is a Foundry VTT module that integrates Dropbox directly into your game. With this module, Game Masters (GMs) can easily create scenes from images stored in their Dropbox account and link Dropbox images to various elements in their game. You can also create playlists using files contained in a Dropbox folder. This integration streamlines the process of managing and utilizing media files, saving time and effort.</p>
<h2>Features</h2>
<ul>
<li><strong>Dropbox Chooser Integration</strong>: Select images directly from your Dropbox account to create scenes within Foundry VTT.</li>
<li><strong>Scene Creation</strong>: Automatically generate scenes using Dropbox images, with dimensions pulled from the image metadata.</li>
<li><strong>File Linking</strong>: Easily link Dropbox images to tiles in Foundry applications.</li>
  <li><strong> New
  Create bulk playlists from multi select files on Dropbox</li></strong>
<li><strong>User-Friendly Interface</strong>: The module adds a convenient button to the Scenes sidebar and relevant UI elements for seamless Dropbox integration.</li>
</ul>
<h2>Installation</h2>
<ol>
<li>Download the module or install it from the Foundry VTT module browser by searching for "Dropboxer".</li>
<li>Enable the module in your Foundry VTT game through the "Manage Modules" menu.</li>
</ol>
<h2>Setup</h2>
<p>Before you can use Dropboxer, you'll need to create a Dropbox App to obtain an App Key.</p>
<h3>Creating a Dropbox App</h3>
<ol>
<li><strong>Visit the Dropbox App Console</strong>: Go to <a target="_new" rel="noreferrer">Dropbox App Console</a>.</li>
<li><strong>Create a New App</strong>: Click on "Create App" and choose "Scoped access".</li>
<li><strong>Select Permissions</strong>:
<ul>
<li><strong>Full Dropbox</strong> or <strong>App Folder</strong> access.</li>
<li>Enable the following permissions:
<ul>
<li><code>files.content.read</code></li>
<li><code>files.content.write</code></li>
<li><code>sharing.read</code></li>
</ul>
</li>
</ul>
</li>
<li><strong>Add Your Foundry Domain</strong>: Add your Foundry VTT domain under "Chooser/Saver" and "Embedder" domains. For example, if your game runs at <code>https://theland.uber.space/game</code>, add <code>theland.uber.space</code> as the domain.</li>
<li><strong>Copy the App Key</strong>: Once the app is created, copy the App Key and paste it into the module settings in Foundry VTT.</li>
</ol>
<h3>Configuring the Module</h3>
<ol>
<li><strong>Access Module Settings</strong>: Go to <code>Settings -&gt; Configure Settings -&gt; Module Settings</code>.</li>
<li><strong>Enter the Dropbox App Key</strong>: Paste the App Key you obtained from Dropbox.</li>
<li><strong>Save Your Settings</strong>.</li>
</ol>
<h2>Usage</h2>
<h3>Creating Scenes from Dropbox</h3>
<ol>
<li><strong>Open the Scenes Sidebar</strong>: Navigate to the Scenes tab in the sidebar.</li>
<li><strong>Click "Choose from Dropbox"</strong>: This button appears next to the "Create Scene" button.</li>
<li><strong>Select an Image</strong>: The Dropbox Chooser will open, allowing you to select an image from your Dropbox.</li>
<li><strong>Create the Scene</strong>: Once selected, a new scene will be created using the chosen image, with its dimensions automatically set.</li>
</ol>
<h3>Linking Dropbox Images in Other Applications</h3>
<ol>
<li><strong>Open an Application</strong>: For example, open the Tile Configuration or Token Configuration application.</li>
<li><strong>Use the Dropbox Button</strong>: Next to the file picker, click the Dropbox icon to open the Dropbox Chooser.</li>
<li><strong>Select an Image</strong>: The selected image will be linked to the relevant input field.</li>
</ol>
<h2>License</h2>
<p>This module is distributed under the MIT License. See the LICENSE file for more details.</p>
<h2>Support</h2>
<p>For issues or suggestions, please visit the <a href="https://github.com/tirzah2/dropboxer" target="_new" rel="noreferrer">GitHub repository</a> or contact the module developer.</p>
