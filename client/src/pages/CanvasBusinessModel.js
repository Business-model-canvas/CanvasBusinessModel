import React, { useState, useRef, useEffect } from "react";
import { CheckCircle, Link, BurstMode } from "@material-ui/icons";
import MyComponent from "../components/container";
import Sticker from "../components/sticker";
import styled from "styled-components";

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

const CanvasBusinessModel = () => {
  const [stickers, setStickers] = useState([]);
  const [cnt, setCnt] = useState(1);
  const [offset, setOffset] = useState();
  const parentRef = useRef(null);

  const duplicate = (x, y, data = "", isEditing = true) => {
    var tmp = [...stickers];
    setCnt(cnt + 1);
    var maxOrder = 0;
    tmp.forEach((item) => {
      if (item.order && maxOrder < item.order) {
        maxOrder = item.order;
      }
    });
    tmp.push({
      x: x,
      y: y - 10 * (stickers.length - 1),
      data: data,
      isEditing: isEditing,
      order: maxOrder + 1
    });
    setStickers(tmp);
  };

  const setOrder = (index) => {
    var tmp = [...stickers];
    console.log("stickers = ", tmp);
    var maxOrder = 0;
    tmp.forEach((item) => {
      if (item.order && maxOrder < item.order) {
        maxOrder = item.order;
      }
    });
    console.log("maxOrder = ", maxOrder);
    tmp[index]["order"] = maxOrder + 1;
    setStickers(tmp);
  };

  const deleteItem = (item) => {
    console.log(item);
    var tmp = [...stickers];
    tmp.splice(item, 1);
    setStickers(tmp);
  };

  const setData = (index, data) => {
    var tmp = [...stickers];
    tmp[index]["data"] = data;
    setStickers(tmp);
  };

  const changePosition = (index, x, y) => {
    var tmp = [...stickers];
    const width = parentRef.current.offsetWidth;
    const height = parentRef.current.offsetHeight;
    tmp[index].x = Math.min(Math.max(0, x), width - 80);
    tmp[index].y = Math.min(Math.max(100, y), height + 20);
    setStickers(tmp);
  };

  useEffect(() => {
    console.log("parent = ", parentRef.current.getBoundingClientRect());
    const boundRect = parentRef.current.getBoundingClientRect();
    setOffset({ x: boundRect.x, y: boundRect.y });
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
        {stickers.map((item, index) => {
          return (
            <Sticker
              x={item.x}
              y={item.y - (index + 1) * 70 - 30}
              data={item.data}
              setData={setData}
              isEditing={item.isEditing}
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

export default CanvasBusinessModel