import React, { useState, useRef, useEffect } from "react";
import { CheckCircle, Link, BurstMode } from "@material-ui/icons";
import MyComponent from "../components/container";
import Sticker from "../components/sticker";
import styled from "styled-components";

import {connect} from "react-redux";
import {createPlaceholder, deletePlaceholder, readCurCanvasData, setPlaceholders} from "../store/action"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 120vh;
  height: 90vh;
  position: relative;
  margin: 5rem;
`;

const RowContainer = styled.div`
  display: flex;
  flex: ${(props) => (props.rows ? props.rows : 1)};
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const CanvasBusinessModel = ({
  socket,
  canvas_data, 
  cur_canvas_id, 
  readCurCanvasData, 
  createPlaceholder, 
  setPlaceholders, 
  deletePlaceholder
}) => {
  // const [stickers, setStickers] = useState(canvas_data);
  const [cnt, setCnt] = useState(1);
  const [offset, setOffset] = useState();
  const [curEditing, setCurEditing] = useState(-1);
  const parentRef = useRef(null);

  const duplicate = async (x, y, data = "", isEditing = true) => {
    console.log('stickers = ', canvas_data);
    var tmp = [...canvas_data];
    setCnt(cnt + 1);
    var maxOrder = 0;
    tmp.forEach((item) => {
      if (item.order && maxOrder < item.order) {
        maxOrder = item.order;
      }
    });

    setCurEditing(canvas_data.length);

    console.log('*** cur_canvas_id = ', cur_canvas_id);
    await createPlaceholder({
      canvas_id: cur_canvas_id,
      coordinate_x: x,
      coordinate_y: y - 10 * (canvas_data.length - 1),
      name: data,
      color: '#fbea70',
      size: 3,
      lock: false,
      isEditing: true,
      order: maxOrder + 1
    });

    // socket.emit('reload_placeholders');
    // tmp.push({
    //   x: x,
    //   y: y - 10 * (stickers.length - 1),
    //   data: data,
    //   isEditing: isEditing,
    //   order: maxOrder + 1
    // });
    // setStickers(tmp);
  };

  const setOrder = (index) => {
    var tmp = [...canvas_data];
    console.log("stickers = ", tmp);
    var maxOrder = 0;
    tmp.forEach((item) => {
      if (item.order && maxOrder < item.order) {
        maxOrder = item.order;
      }
    });
    console.log("maxOrder = ", maxOrder);
    tmp[index]["order"] = maxOrder + 1;
    setPlaceholders({data: tmp, id: cur_canvas_id});
    // socket.emit('reload_placeholders');

  };

  const deleteItem = (index) => {
    deletePlaceholder({data: canvas_data[index], id: cur_canvas_id});
    // socket.emit('reload_placeholders');
  };

  const setData = (index, data) => {
    var tmp = [...canvas_data];
    tmp[index]["name"] = data;
    setPlaceholders({data: tmp, id: cur_canvas_id});
    // socket.emit('reload_placeholders');
  };

  const setColor = (index, color) => {
    var tmp = [...canvas_data];
    tmp[index]["color"] = color;
    setPlaceholders({data: tmp, id: cur_canvas_id});
    // socket.emit('reload_placeholders');
  };

  const setSize = (index, size) => {
    var tmp = [...canvas_data];
    tmp[index]["size"] = size;
    setPlaceholders({data: tmp, id: cur_canvas_id});
    // socket.emit('reload_placeholders');
  };

  const setLock = (index, lock) => {
    var tmp = [...canvas_data];
    tmp[index]["lock"] = lock;
    setPlaceholders({data: tmp, id: cur_canvas_id});
    // socket.emit('reload_placeholders');
  };

  const changePosition = (index, x, y) => {
    var tmp = [...canvas_data];
    const width = parentRef.current.offsetWidth;
    const height = parentRef.current.offsetHeight;
    tmp[index].coordinate_x = Math.min(Math.max(0, x), width - 80);
    tmp[index].coordinate_y = Math.min(Math.max(100, y), height + 20);
    setPlaceholders({data: tmp, id: cur_canvas_id});
    // socket.emit('reload_placeholders');
  };

  useEffect(()=>{
    console.log('cur_canvas_id = ', cur_canvas_id);
    readCurCanvasData({id: cur_canvas_id})
    socket.on('reload', ()=>{
      readCurCanvasData({id: cur_canvas_id});
    })
  }, []);

  useEffect(() => {
    console.log("parent = ", parentRef.current.getBoundingClientRect());
    const boundRect = parentRef.current.getBoundingClientRect();
    setOffset({ x: boundRect.x, y: boundRect.y });
    // socket.emit('reload_placeholders');
  }, [parentRef]);

  return (
    <Container
      onDoubleClick={(e) => {
        console.log("x, y = ", e.screenX, e.screenY);
        duplicate(e.screenX - offset.x, e.screenY - offset.y);
      }}
      ref={parentRef}
    >
      <RowContainer rows={2}>
        <MyComponent
          title="Key Partnerships"
          icon={<Link style={styles.largeIcon} />}
        />
        <ColumnContainer>
          <MyComponent
            title="Key Activities"
            icon={<CheckCircle style={styles.largeIcon} />}
          />
          <MyComponent
            title="Key Resources"
            icon={<BurstMode style={styles.largeIcon} />}
          />
        </ColumnContainer>
        <MyComponent
          title="Value Propositions"
          icon={<CheckCircle style={styles.largeIcon} />}
        />
        <ColumnContainer>
          <MyComponent
            title="Customer Relationships"
            icon={<CheckCircle style={styles.largeIcon} />}
          />
          <MyComponent
            title="Channels"
            icon={<CheckCircle style={styles.largeIcon} />}
          />
        </ColumnContainer>
        <MyComponent
          title="Customer Segments"
          icon={<CheckCircle style={styles.largeIcon} />}
        />
      </RowContainer>
      <RowContainer>
        <MyComponent
          title="Cost Structure"
          icon={<CheckCircle style={styles.largeIcon} />}
        />
        <MyComponent
          title="Revenue Streams"
          icon={<CheckCircle style={styles.largeIcon} />}
        />
      </RowContainer>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "120vh",
          height: "90vh"
        }}
      >
        {canvas_data && canvas_data.map((item, index) => {
          return (
            <Sticker
              x={item.coordinate_x}
              y={item.coordinate_y - (index + 1) * 70 - 30}
              data={item.name}
              setData={setData}
              color={item.color}
              setColor={setColor}
              size={item.size}
              setSize={setSize}
              isLocked={item.lock}
              setLocked={setLock}
              isEditing={index == curEditing ? true : false}
              order={item.order}
              setOrder={setOrder}
              offset={offset}
              onMove={changePosition}
              onDuplicate={duplicate}
              onDelete={deleteItem}
              id={index}
            />
          );
        })}
      </div>
    </Container>
  );
}

const styles = {
  largeIcon: {
    width: 15,
    height: 15
  }
};

const mapStateToProps = (state, ownProps) => ({
  canvas_data: state.canvas.canvas_data,
  cur_canvas_id: state.canvas.cur_canvas_id,
  socket: state.canvas.socket
})
const mapDispatchToProps = dispatch => ({
  createPlaceholder: createPlaceholder(dispatch),
  readCurCanvasData: readCurCanvasData(dispatch),
  setPlaceholders: setPlaceholders(dispatch),
  deletePlaceholder: deletePlaceholder(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CanvasBusinessModel);