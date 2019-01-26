import React, { Component } from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components'
import './App.css'

let lastId = 0
const uuid = () => lastId++

const animationDuration = 400
const outStates = ['entering', 'exiting']
const bottomMargin = 20
const height = 80

class App extends Component {
  constructor (/*props*/) {

    /*
    Interesting segue: (Not really part of this demo)
     super(props) lets you access this.props in the constructor. 
     But it's not heaps necessary becuase you can just use the 
     'props' variable

     After the constructor props will automatically applied to this
     ... I think ¯\_(ツ)_/¯
    */

    super(/*props*/)

    this.state = {
      items: [
        { id: uuid(), text: 'Buy eggs' },
        { id: uuid(), text: 'Pay bills' },
        { id: uuid(), text: 'Invite friends over' },
        { id: uuid(), text: 'Fix the TV' },
      ]
    }

  }
  render() {
    return (
      /*
      Most of the work is done in the Transition (imported) component
      The TransitionGroup (imported) component just automatically 
      adds the in={true|false} prop to its children
      */
      <section>
        <h1>Items</h1>
        <TransitionGroup length={this.state.items.length} component={TransitionParent}>
          {
            this.state.items.map(
              (item, i) => {
                const itemID = item.id
                console.log(item)
                return (
                  <Item 
                  item={item} 
                  index={i}
                  key={itemID}
                  remove={
                    // Pass props.remove to child. Which can be called to remove it from the array
                    () => this.setState({
                      items: this.state.items.filter(x => x.id !== itemID)
                    })
                  }
                  />
                )
              }
            )
          }
        </TransitionGroup>
        <AddButton 
        add={item => this.setState({items: [...this.state.items, item]})}
        />
      </section>
    );
  }
}

// This is what TransitionGroup will render as
const TransitionParent = styled.div`
  height: ${props => props.length * height + props.length * bottomMargin}px;
  position: relative;
  transition: height ${animationDuration/1000}s;
`

const AddButton = props => {

  // This function will prompt the user for a new item name
  // and if it is valid it will use props.add to add it to the item array

  const doAdd = () => {
    const name = prompt('Add an Item.\nName: ')
    if (name) {
      props.add(
        {
          id: uuid(),
          text: name
        }
      )
    } else {
      alert('Name was not valid')
    }
  }

  return (
    <button onClick={doAdd}>
      Add Item
    </button>
  )
}


/* 
  Item component (Renders the Transition component (And passes it the 'in' prop from the TransitionGroup))
*/
const Item = props => {
  return (
    <Transition 
    key={props.item.id} 
    timeout={animationDuration}
    in={props.in}
    // If appear is set to false Item will only animate after Transition is mounted (so it will not run the first time)
    appear
    unmountOnExit
    mountOnEnter
    /* 
    Transition element also has lots of optional events you can hook into
    (But you dont necessarily have to)
    The events are:
      onEnter={this.onEnterFunction}
      onEntering={this.onEnteringFunction}
      onEntered={this.onEnteredFunction}
      onExit={this.onExitFunction}
      onExiting={this.onExitingFunction}
      onExited={this.onExitedFunction}

    Also the Transition component also expects a single function as a child. It will then pass 
    the current state of the transition to the child 
    Ths transitionState variable (below) will be one of the following:
      'entering',
      'entered',
      'exiting',
      'exited'
    */
    >
      {
        // This child will render the list (or the page in your case)
        (transitionState) => {
          return (
            <ItemWrapper
            index={props.index}
            isIn={!outStates.includes(transitionState)}
            // This on click event will remove this item from the array of items
            onClick={props.remove}
            >
              Item text: {props.item.text}. Transition State = {transitionState}
            </ItemWrapper>
          )
        } 
      }
    </Transition>
    
  )
}

const ItemWrapper = styled.div`
  padding: 10px 20px;
  height: ${height}px;
  background: rgba(0, 0, 0, 0.2);
  opacity: ${props => props.isIn ? 1 : 0};
  transition: top ${animationDuration / 1000}s, transform ${animationDuration / 1000}s, opacity ${animationDuration/1000}s;
  cursor: pointer;
  position: absolute;
  transform: translateX(${props => props.isIn ? 0 : 80}px) scale(${props => props.isIn ? 1 : 0.8});
  top: ${props => props.index * height + props.index * bottomMargin}px;
`

export default App;
