import React, { Component } from 'react'

import '../styles/normalize.css'
import '../styles/custom.css'
import '../styles/range.scss'
import '../styles/VideoPlayer.css'

export default class VideoControls extends Component {
    state = {
        volume: 0,
        fullscreen: false,
        likes: 0,
        dislikes: 0
    }

    render() {
        return (
            <>
                {/* controls should include:
                 * volume
                 * fullscreen
                 * like/dislike
                 * 
                 * */}
            </>
        )
    }
}