import React, { Component } from 'react'

import '../styles/normalize.css'
import '../styles/custom.css'
import '../styles/range.scss'
import '../styles/VideoPlayer.css'

import { version } from '../../package.json'
import ReactPlayer from 'react-player/youtube'
import Duration from './Duration'

const videoUrlQueue = [
    "https://www.youtube.com/watch?v=2lTQEYLAnmM",
    "https://www.youtube.com/watch?v=xpgZu36qJTE",
    "https://www.youtube.com/watch?v=T7FjVSoLOSo",
    "https://www.youtube.com/watch?v=Cgv3X5wOH-c",
    "https://www.youtube.com/watch?v=WfjjJF-kCOE",
    "https://www.youtube.com/watch?v=Whr6y-lllv0"
] // for testing

export default class VideoPlayer extends Component {
    state = {
        queueIdx: 0,
        url: null,
        pip: false,
        playing: true,
        controls: false,
        light: false,
        volume: 0.8,
        muted: true,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false,
        showState: true
    }

    load = url => {
        this.setState({
            url,
            played: 0,
            loaded: 0,
            pip: false
        })
    }

    componentDidMount = () => {
        this.setState({
            url: videoUrlQueue[this.state.queueIdx],
            queueIdx: this.state.queueIdx + 1
        })
    }

    handlePlayPause = () => {
        this.setState({ playing: !this.state.playing })
    }

    handleStop = () => {
        this.setState({ url: null, playing: false })
    }

    handleVolumeChange = e => {
        this.setState({ volume: parseFloat(e.target.value) })
    }

    handleSetPlaybackRate = e => {
        this.setState({ playbackRate: parseFloat(e.target.value) })
    }

    handleOnPlaybackRateChange = (speed) => {
        this.setState({ playbackRate: parseFloat(speed) })
    }

    handleTogglePIP = () => {
        this.setState({ pip: !this.state.pip })
    }

    handlePlay = () => {
        console.log('onPlay')
        this.setState({ playing: true })
    }

    handleEnablePIP = () => {
        console.log('onEnablePIP')
        this.setState({ pip: true })
    }

    handleDisablePIP = () => {
        console.log('onDisablePIP')
        this.setState({ pip: false })
    }

    handlePause = () => {
        console.log('onPause')
        this.setState({ playing: false })
    }

    handleSeekMouseDown = e => {
        this.setState({ seeking: true })
    }

    handleSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
    }

    handleSeekMouseUp = e => {
        this.setState({ seeking: false })
        this.player.seekTo(parseFloat(e.target.value))
    }

    handleProgress = state => {
        console.log('onProgress', state)
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state)
        }
    }

    handleEnded = () => {
        if (this.state.queueIdx < videoUrlQueue.length) {
            this.setState({ url: videoUrlQueue[this.state.queueIdx], queueIdx: this.state.queueIdx + 1 })
        }
        else console.log('end of playlist')
    }

    handleDuration = (duration) => {
        console.log('onDuration', duration)
        this.setState({ duration })
    }

    renderLoadButton = (url, label) => {
        return (
            <button onClick={() => this.load(url)}>
                {label}
            </button>
        )
    }

    ref = player => {
        this.player = player
    }

    render() {
        const { queueIdx, url, playing, controls, light, volume, muted, loop, played, loaded, duration, playbackRate, pip, showState } = this.state
        const SEPARATOR = ' · '

        return (
            <div className='app'>
                <section className='section'>
                    <div className="tv-wrapper">
                        <div className='player-wrapper'>
                            <ReactPlayer
                                ref={this.ref}
                                className='react-player'
                                width='800px'
                                height='480px'
                                url={url}
                                pip={pip}
                                playing={playing}
                                controls={controls}
                                light={light}
                                loop={loop}
                                playbackRate={playbackRate}
                                volume={volume}
                                muted={muted}
                                onReady={() => console.log('onReady')}
                                onStart={() => console.log('onStart')}
                                onPlay={this.handlePlay}
                                onEnablePIP={this.handleEnablePIP}
                                onDisablePIP={this.handleDisablePIP}
                                onPause={this.handlePause}
                                onBuffer={() => console.log('onBuffer')}
                                onPlaybackRateChange={this.handleOnPlaybackRateChange}
                                onSeek={e => console.log('onSeek', e)}
                                onEnded={this.handleEnded}
                                onError={e => console.log('onError', e)}
                                onProgress={this.handleProgress}
                                onDuration={this.handleDuration}
                            />
                            <progress max={1} value={played} />
                        </div>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                                <th>Controls</th>
                                <td>
                                    <button onClick={this.handleStop}>Stop</button>
                                    <button onClick={this.handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
                                    <button onClick={this.handleClickFullscreen}>Fullscreen</button>
                                    {ReactPlayer.canEnablePIP(url) &&
                                        <button onClick={this.handleTogglePIP}>{pip ? 'Disable PiP' : 'Enable PiP'}</button>}
                                </td>
                            </tr>
                            <tr>
                                <th>Speed</th>
                                <td>
                                    <button onClick={this.handleSetPlaybackRate} value={1}>1x</button>
                                    <button onClick={this.handleSetPlaybackRate} value={1.5}>1.5x</button>
                                    <button onClick={this.handleSetPlaybackRate} value={2}>2x</button>
                                </td>
                            </tr>
                            {/* <tr>
                                <th>Seek</th>
                                <td>
                                    <input
                                        type='range' min={0} max={0.999999} step='any'
                                        value={played}
                                        onMouseDown={this.handleSeekMouseDown}
                                        onChange={this.handleSeekChange}
                                        onMouseUp={this.handleSeekMouseUp}
                                    />
                                </td>
                            </tr> 
                            <tr>
                                <th>Loaded</th>
                                <td><progress max={1} value={loaded} /></td>
                            </tr> */}
                            <tr>
                                <th>Volume</th>
                                <td>
                                    <input type='range' min={0} max={1} step='any' value={volume} onChange={this.handleVolumeChange} />
                                </td>
                            </tr>

                            <tr>
                                <th>Custom URL</th>
                                <td>
                                    <input ref={input => { this.urlInput = input }} type='text' placeholder='Enter URL' />
                                    <button onClick={() => this.setState({ url: this.urlInput.value })}>Load</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section>
                    <button onClick={() => this.setState({ showState: !showState })}>{showState ? 'Hide ' : 'Show '}Component State</button>
                    {showState &&
                        <table>
                            <tbody>
                                <tr>
                                    <th>queueIdx</th>
                                    <td>{queueIdx}</td>
                                </tr>
                                <tr>
                                    <th>url</th>
                                    <td className={!url ? 'faded' : ''}>
                                        {(url instanceof Array ? 'Multiple' : url) || 'null'}
                                    </td>
                                </tr>
                                <tr>
                                    <th>playing</th>
                                    <td>{playing ? 'true' : 'false'}</td>
                                </tr>
                                <tr>
                                    <th>volume</th>
                                    <td>{volume.toFixed(3)}</td>
                                </tr>
                                <tr>
                                    <th>speed</th>
                                    <td>{playbackRate}</td>
                                </tr>
                                <tr>
                                    <th>played</th>
                                    <td>{played.toFixed(3)}</td>
                                </tr>
                                <tr>
                                    <th>loaded</th>
                                    <td>{loaded.toFixed(3)}</td>
                                </tr>
                                <tr>
                                    <th>duration</th>
                                    <td><Duration seconds={duration} /></td>
                                </tr>
                                <tr>
                                    <th>elapsed</th>
                                    <td><Duration seconds={duration * played} /></td>
                                </tr>
                                <tr>
                                    <th>remaining</th>
                                    <td><Duration seconds={duration * (1 - played)} /></td>
                                </tr>
                                <tr>
                                    <th>showState</th>
                                    <td>{String(showState)}</td>
                                </tr>
                            </tbody>
                        </table>
                    }
                </section>
                <footer className='footer'>
                    Version <strong>{version}</strong>
                    {SEPARATOR}
                    <a href='https://github.com/CookPete/react-player'>GitHub</a>
                    {SEPARATOR}
                    <a href='https://www.npmjs.com/package/react-player'>npm</a>
                </footer>
            </div>
        )
    }
}