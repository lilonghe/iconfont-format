import Icon from "./icon";

export default function Index() {
    return <div>
        <Icon type='icon-xuehua' />
        <Icon type='icon-xuehua' color='red' />
        <Icon type='icon-computer' size={30} />
        <div style={{ fontSize: 40 }}>
            <Icon type='icon-computer' color='green'  />
        </div>
    </div>
}