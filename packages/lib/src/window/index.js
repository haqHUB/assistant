import React, { useState, createRef, createContext, useContext } from 'react'
import classname from 'classnames'
import { Flipped, Flipper } from 'react-flip-toolkit'
import './style.scss'

const transition = {
    /*stiffness: 700,
    damping: 50,*/
    stiffness: 500,
    damping: 30,
}

const adminBarSize = () => {
    const mobile = window.matchMedia('screen and (max-width: 782px)')
    if ( mobile.matches ) {
        return 46
    }
    return 32
}

export const WindowContext = createContext()
WindowContext.displayName = 'WindowContext'



export const Window = ({
        children,
        title,
        icon,
        size: initialSize = 'mini',
        isHidden: initialIsHidden = false,
        position: initialPosition = [0, 0],
        ...rest
    }) => {

    // Is Hidden
    const [isHidden, setIsHidden] = useState( initialIsHidden )
    const toggleIsHidden = () => {
        setIsHidden( !isHidden )
        requestAnimate()
    }

    // Size
    const defaultSize = 'mini'
    const sizes = ['mini', 'normal']
    const [size, setSize] = useState( sizes.includes( initialSize ) ? initialSize : defaultSize )
    const toggleSize = () => {
        setSize( 'mini' === size ? 'normal' : 'mini' )
        requestAnimate()
    }

    // Position
    const [position, setPosition] = useState( initialPosition )

	// Animation
	const shouldAnimate = true
    const [ needsAnimate, setNeedsAnimate ] = useState( 0 )
	const requestAnimate = () =>  shouldAnimate && setNeedsAnimate( needsAnimate + 1 )

    const context = {
        isHidden,
        setIsHidden,
        toggleIsHidden,

        size,
        setSize,
        toggleSize,

        position,
        setPosition,

        requestAnimate,
    }
    return (
        <Flipper flipKey={needsAnimate}>
            <WindowContext.Provider value={context}>
                <WindowLayer {...rest}>
                    { !isHidden && <MiniPanel title={title}>{children}</MiniPanel> }
                    { isHidden && <WindowButton title={title}>{icon}</WindowButton> }
                </WindowLayer>
            </WindowContext.Provider>
        </Flipper>
    )
}

const WindowLayer = ({
        className,
        children,
        ...rest
    }) => {
    const { requestAnimate, size, isHidden, position, setPosition } = useContext( WindowContext )
    const ref = createRef()

    // Window Movement
    const [isDragging, setIsDragging] = useState( false )
    const [initialPos, setInitialPos] = useState( { x: null, y: null } )
    const [currentPos, setCurrentPos] = useState( { x: null, y: null } )
    const [offset, setOffset] = useState( { x: 0, y: 0 } )

    const dragStart = e => {

        if (e.type === "touchstart") {
            setInitialPos({
                x: e.touches[0].clientX - offset.x,
                y: e.touches[0].clientY - offset.y
            })
        } else {
            setInitialPos({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y
            })
        }
        setIsDragging( true )
    }

    const drag = e => {
        if ( isDragging ) {

            e.preventDefault()

            if ( e.type === "touchmove" ) {
                setCurrentPos({
                    x: e.touches[0].clientX - initialPos.x,
                    y: e.touches[0].clientX - initialPos.y,
                })
            } else {
                setCurrentPos({
                    x: e.clientX - initialPos.x,
                    y: e.clientY - initialPos.y,
                })
            }
            setOffset( Object.assign({}, currentPos ) )
        }
    }

    const dragEnd = e => {
        const x = e.clientX > ( ref.current.clientWidth / 2 ) ? 1 : 0
        const y = e.clientY > ( ref.current.clientHeight / 2 ) ? 1 : 0

        const reset = { x: 0 , y: 0 }
        setInitialPos( reset )
        setCurrentPos( reset )
        setOffset( reset )
        setIsDragging( false )

        setPosition([x,y])
        requestAnimate()
    }

    const classes = classname({
        'fl-asst-window-layer' : true,
        'fl-asst-window-layer-is-dragging' : isDragging,
    }, className )

    const props = {
        ...rest,
        ref,
        className: classes,
        onTouchStart: dragStart,
        onTouchEnd: dragEnd,
        onTouchMove: drag,
        onMouseDown: dragStart,
        onMouseUp: dragEnd,
        onMouseMove: drag,
    }

    const { x: xPos, y: yPos } = currentPos
    const transform = isDragging ? "translate3d(" + xPos + "px, " + yPos + "px, 0)" : ""

    const [windowX, windowY] = position
    const pad = 15
    let positionerStyles = {
        position: 'absolute',
        top: windowY ? 'auto' : adminBarSize() + pad,
        bottom: windowY ? pad : 'auto',
        right: windowX ? pad : 'auto',
        left: windowX ? 'auto' : pad,
        transform,
    }
    if ( 'normal' === size && !isHidden ) {
        positionerStyles = {
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: windowX ? 0 : 'auto',
            left: windowX ? 'auto' : 0,
            transform,
        }
    }

    return (
        <div {...props}>
            { isDragging && <WindowDropZones /> }
            <div style={positionerStyles}>{children}</div>
        </div>
    )
}

const MiniPanel = ({ className, children, title, ...rest }) => {
    const { toggleIsHidden, toggleSize, size } = useContext( WindowContext )
    const classes = classname({
        'fl-asst-window' : true,
        [`fl-asst-window-${size}`] : size,
    }, className )

    return (
        <Flipped flipId="window" spring={transition}>
            <div className={classes} {...rest}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="fl-asst-window-toolbar">

                        {title}

                        <span onMouseDown={ e => e.stopPropagation() } style={{ marginLeft: 'auto' }}>
                            <button onClick={toggleSize}>[ ]</button>
                            <button onClick={toggleIsHidden}>X</button>
                        </span>
                    </div>
                    <div className="fl-asst-window-content fl-asst-window-move-handle" onMouseDown={ e => e.stopPropagation() }>{children}</div>
                </div>
            </div>
        </Flipped>
    )
}

const WindowDropZones = props => {
    const topBar = {
        flexBasis: adminBarSize(),
    }
    return (
        <div className="fl-asst-window-drop-zones" {...props}>
            <div className="fl-asst-window-drop-zones-top-bar" style={topBar} />
            <div className="fl-asst-window-drop-zone-area">
                <DropZone />
                <DropZone />
                <DropZone />
                <DropZone />
            </div>
        </div>
    )
}

const DropZone = () => {
    const classes = classname({
        'fl-asst-window-drop-zone' : true
    })
    return (
        <div className={classes} />
    )
}

export const WindowButton = ({ children, title, ...rest }) => {
    const { toggleIsHidden } = useContext( WindowContext )
    return (
        <Flipped flipId="window" spring={transition}>
            <button className="fl-asst-window-button" onClick={toggleIsHidden} {...rest}>
                <Flipped inverseFlipId="window">{ children ? children : <div>{title}</div> }</Flipped>
            </button>
        </Flipped>
    )
}
