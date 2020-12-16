import React, { Component } from "react"
import axios from "axios"
export default class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: "",
  }
  componentDidMount() {
    this.fetchValues()
    this.fetchIndexes()
  }
  fetchValues = async () => {
    const values = await axios.get("/api/values/current")
    this.setState({ values: values.data })
  }
  fetchIndexes = async () => {
    const seenIndexes = await axios.get("/api/values/all")
    this.setState({ seenIndexes: seenIndexes.data })
  }
  renderSeenIndexes = () => {
    return this.state.seenIndexes.map(({ number }) => number).join(",")
  }
  renderValues = () => {
    const entries = []
    for (const key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      )
    }
    return entries
  }
  onFormSubmit = async (event) => {
    event.preventDefault()
    await axios.post("/api/values", {
      index: this.state.index,
    })
    this.setState({ index: "" })
  }
  render() {
    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
          <h3>Indexes I have seen:</h3>
          {this.renderSeenIndexes()}
          <h3>Calculated Values:</h3>
          {this.renderValues()}
        </form>
      </div>
    )
  }
}
