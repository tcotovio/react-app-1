import React from 'react'
import PropTypes from 'prop-types'
import {partial} from '../../lib/utils'

 export const TodoItem = (props) => {
     //needed because the function asks for an argument (id)
     const handleToggle = partial(props.handleToggle, props.id)
     const handleRemove = partial(props.handleRemove, props.id)
     return (
        <li>
            <span className='delete-item'>
                <a href="#" onClick={handleRemove}>X</a>
            </span>
            <input  type = 'checkbox' onChange = {handleToggle} 
                        checked = {props.isComplete}/>{props.name}
        </li>
    )
 }  

 TodoItem.propTypes = {
     name: PropTypes.string.isRequired,
     isComplete: PropTypes.bool, //not required because false when default
     id: PropTypes.number.isRequired
 }