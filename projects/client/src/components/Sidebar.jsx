import { Flexboard, FlexboardProvider, FlexboardFrame, ResizerType, Position } from '@dorbus/flexboard';

const Sidebar = () => {
   
  return (
    <FlexboardProvider>
            <Flexboard
            direction={Position.left}
            draggable={true}
            width={400}
            minWidth={200}
            maxWidth={600}
            flexboardStyle={{ backgroundColor: "#f2f3f4" }}
            resizerStyle={{ backgroundColor: "pink" }}
            resizerType={ResizerType.gutterlane}
            >
                <div>Flexboard Content</div>
            </Flexboard>
            <FlexboardFrame>
                <div>Frame Content</div>
            </FlexboardFrame>
    </FlexboardProvider>
  );
};

export default Sidebar;
