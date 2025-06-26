import { useState } from 'react';
import Tab from './components/Tab';
import Timer from './components/Timer';
import Settings from './components/Settings';
import './App.css';

const defaultObjectives = [
	{
		label: 'Buff',
		time: 285,
		message: '15 seconds until the Buff appears',
		audio: 'Buff in 15 seconds',
		repeat: 300,
	},
	{
		label: 'Vault',
		time: 465,
		message: '15 seconds until the Vault appears',
		audio: 'Vault in 15 seconds',
	},
	{
		label: 'Urn',
		time: 570,
		message: '30 seconds until the Urn appears',
		audio: 'Urn in 30 seconds',
		repeat: 300,
	},
	{
		label: 'Guardian',
		time: 875,
		message: 'Destroy the Guardians',
		audio: 'Destroy the Guardians',
	},
	{
		label: 'Walker',
		time: 1115,
		message: 'Destroy the Walkers',
		audio: 'Destroy the Walkers',
	},
	{
		label: 'Mid-Boss',
		time: 1380,
		message: 'Destroy the Mid-Boss',
		audio: 'Destroy the Mid-Boss',
	},
];

function App() {
	const [tab, setTab] = useState<'Timer' | 'Settings'>('Timer');
	const [objectives, setObjectives] = useState(defaultObjectives);

	return (
		<div className="app-container">
			<div className="tabs">
				<Tab
					label="Timer"
					active={tab === 'Timer'}
					onClick={() => setTab('Timer')}
				/>
				<Tab
					label="Settings"
					active={tab === 'Settings'}
					onClick={() => setTab('Settings')}
				/>
			</div>
			<div className="tab-content">
				{tab === 'Timer' ? (
					<Timer objectives={objectives} />
				) : (
					<Settings objectives={objectives} onUpdate={setObjectives} />
				)}
			</div>
      <div>
        <p className="footer">
          This uses audio for the objective message, so make sure your volume is up! <br></br>
          Made with ❤️ by Paalows <br></br>
          If you like this app, please consider supporting me by subscribing to my channels. <br></br>
          It helps me keep making tools like this for the community! <br></br>
		      <a href="https://twitch.tv/paalows" target="_blank" rel="noopener noreferrer">twitch.tv/paalows</a><br></br>
          <a href="https://youtube.com/@paalows" target="_blank" rel="noopener noreferrer">youtube.com/@paalows</a><br></br>
          <a href="https://tiktok.com/@paalows" target="_blank" rel="noopener noreferrer">tiktok.com/@paalows</a><br></br>
          <a href="https://instagram.com/gvlnn" target="_blank" rel="noopener noreferrer">instagram.com/gvlnn</a>

        </p>
      </div>
		</div>
	);
}

export default App;
