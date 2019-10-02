import { h } from "../../core";

export default function TestList(props) {
	return (
		<div ref={props.ref}>
			{props.list.map(data => (
				<button key={props.witKeys ? data.key : undefined}>
					{data.key}
				</button>
			))}
		</div>
	);
}
