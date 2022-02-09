import React, { Component } from 'react'

import '../../styles/range.scss'
import '../../styles/VideoPlayer.css'

import ReactPlayer from 'react-player/youtube'
import Duration from './Duration'

export default class VideoPlayer extends Component {
    state = {
        url: null,
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
        showState: false
    }

    load = url => {
        this.setState({
            url,
            played: 0,
            loaded: 0,
            pip: false
        })
    }

    componentDidMount() {
        if (!this.state.url) {
            this.props.getNextVideo()
                .then(() => {
                    this.load(this.props.video.url)
                });
        }
    }

    handleMute = () => {
        this.setState({ muted: !this.state.muted })
    }

    handleVolumeChange = e => {
        this.setState({ volume: parseFloat(e.target.value) })
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
        this.props.getNextVideo();
        this.setState({ url: null });
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
        const { url, playing, controls, light, volume, muted, loop, played, loaded, duration, playbackRate, showState } = this.state

        return (
            <div className='vplayer'>
                <section className='section'>
                    <div className='player-wrapper'>
                        <ReactPlayer
                            ref={this.ref}
                            className='react-player'
                            width='800px'
                            height='480px'
                            url={url}
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
                            onPause={this.handlePause}
                            onBuffer={() => console.log('onBuffer')}
                            onSeek={e => console.log('onSeek', e)}
                            onEnded={this.handleEnded}
                            onError={e => console.log('onError', e)}
                            onProgress={this.handleProgress}
                            onDuration={this.handleDuration}
                        />
                        <progress max={1} value={played} />
                    </div>
                </section>
                <section>
                <table>
                        <tbody>
                            <tr>
                                <th>Controls</th>
                                <td>
                                    <button onClick={this.handleMute}>{muted ? 'Unmute' : 'Mute'}</button>
                                    <button onClick={this.handleClickFullscreen}>Fullscreen</button>
                                    <button onClick={this.handleEnded}>Skip</button>
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
                        </tbody>
                    </table>
                    
                    
                    <button onClick={() => this.setState({ showState: !showState })}>{showState ? 'Hide ' : 'Show '}Component State</button>
                    
                    {showState &&
                        <table>
                            <tbody>
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
            </div>
        )
    }
}