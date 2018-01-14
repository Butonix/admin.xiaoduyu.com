import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './style.scss'

import Shell from '../shell'
import PostsList from '../../components/posts-list'

import { loadTopics } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'

export class Posts extends React.Component {

  static mapStateToProps = (state, props) => {
    return {
      topicList: getTopicListByName(state, 'posts')
    }
  }

  static mapDispatchToProps = { loadTopics }

  constructor(props) {
    super(props)
    this.state = {
      timestamp: new Date().getTime(),
      filters: {
        options: { sort: { sort_by_date: - 1 } }
      },
      params: {
        sortBy: 'sort_by_date'
      }
    }
    this.submit = this.submit.bind(this)
    this.valueOnChange = this.valueOnChange.bind(this)

  }

  componentDidMount() {
    this.props.loadTopics({ name: 'posts', filters:{} })
  }

  valueOnChange(e, name) {
    if (e.target.value) {
      this.state.params[name] = e.target.value
    } else {
      delete this.state.params[name]
    }

  }

  submit(event) {

    if (event) event.preventDefault()

    let filters = {
      query: {},
      select: {},
      options: {
        sort: {}
      }
    }

    let { params } = this.state

    for (let i in params) {
      switch (i) {
        case 'sortBy': filters.options.sort[params[i]] = -1; break
        case 'status': filters.query[params[i]] = true; break
        case 'startDate':
          if (!filters.query.create_at) filters.query.create_at = {}
          filters.query.create_at['$lte'] = params[i]
          break
        case 'endDate':
          if (!filters.query.create_at) filters.query.create_at = {}
          filters.query.create_at['$gte'] = params[i]
          // filters.query.gte_create_at = params[i];
          break
        default: filters.query[i] = params[i]
      }
    }

    this.setState({ filters, timestamp: new Date().getTime() })
    return false

  }

  componentWillMount() {
  }

  render() {

    const { filters, timestamp, params } = this.state
    const { sortBy, status, topic_id } = params
    const { topicList } = this.props

    return(<div>

        <h1>帖子</h1>

        <form className="form" onSubmit={this.submit}>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>排序</label>
          <div className="unit">
            <select onChange={e=>this.valueOnChange(e, 'sortBy')} defaultValue={sortBy}>
              <option value="sort_by_date">按排序日期</option>
              <option value="create_at">按创建日期</option>
            </select>
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>状态</label>
          <div className="unit">
            <select onChange={e=>this.valueOnChange(e, 'status')} defaultValue={status}>
              <option value="">所有</option>
              <option value="weaken">弱化</option>
              <option value="deleted">删除</option>
              <option value="recommend">推荐</option>
            </select>
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>ID</label>
          <div className="unit">
            <input ref="postsId" type="text" placeholder="请输入id" onChange={e=>this.valueOnChange(e, '_id')} />
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>日期筛选</label>
          <div className="unit">
            <input ref="startDate" type="text" placeholder="创建日期小于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'startDate')} />
            <input ref="endDate" type="text" placeholder="创建日期大于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'endDate')} />
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>话题</label>
          <div className="unit">
            <select onChange={e=>this.valueOnChange(e, 'topic_id')} defaultValue={topic_id}>
              <option value="">所有</option>
              {topicList.data && topicList.data.map(item=>{
                return (<option value={item._id} key={item._id}>{item.name}</option>)
              })}
            </select>
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>用户ID</label>
          <div className="unit">
            <input ref="postsId" type="text" placeholder="请输入用户的id" onChange={e=>this.valueOnChange(e, 'user_id')} />
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}></label>
          <div className="unit">
            <button type="submit" className="btn btn-primary">搜索</button>
          </div>
        </div>

      </form>

      <br /><br />

      <PostsList name="home" timestamp={timestamp} filters={filters} />
    </div>)
  }

}

Posts = CSSModules(Posts, styles)

export default Shell(Posts)
