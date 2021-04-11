import './CourseView.css';

function CourseView(props) {
    return (
        <div style={{width: props.width, height: props.height}} className="courseView">
            <h1>{props.node.name}</h1>
            <p>{props.node.desc}</p>
        </div>);
}

export default CourseView;