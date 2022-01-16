import React, { useState, useEffect, useContext } from 'react'
import { Alert, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function AlertBox(props) {
	const [show, setShow] = useState(false)

	useEffect(() => {
		console.log('inside', props)
		if (props.show == true) {
			setShow(true)
		}
	}, [props])

	return (
		<> {show == true ? (
			<Col sm={3} style={{
				position: 'fixed',
				top: '70px',
				right: '0px',
			}}>
				<Alert variant={props.variant} onClose={() => setShow(false)} dismissible>
					<Alert.Heading>{props.head}</Alert.Heading>
					<p>
						{props.body}
					</p>
				</Alert>
			</Col>
		) : ''
		}
		</>
	)
}
