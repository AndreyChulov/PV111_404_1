import "./Css/Road_404.css"
import Road_404_Generator from "./Road_404_Generator";
import road_404 from "./Game/Road_404";
import {useState, useRef, useEffect} from "react"
import {syntaxErrorFactory} from "css-loader/dist/utils";

function Road_404(){
    road_404.GenerateLevel();
    road_404.RoadSize = 30;

    const [road, setRoad] = useState(road_404.Road)
    const trRef = useRef(null)
    let cellSize = null;
    let tdOffset = 0;
    let isRedrawPending = true;
    let _playerOffsetSetter = (offset) => {};

    /*setTimeout(() =>{
        road_404.MoveRoad();
        setRoad(road_404.Road);
    }, 1000)*/

    function GetTdSize(getTdSize){
        //console.log("Size=", getTdSize());
        cellSize = getTdSize();
    }

    function SetPlannedTrMove(timeout){
        setTimeout(() =>{
            if (trRef.current == null || cellSize == null){
                SetPlannedTrMove(timeout);
                return;
            }

            tdOffset -= 1;
            let nextUpdateNeeded = true;

            if (tdOffset <= -cellSize){
                tdOffset += cellSize;
                nextUpdateNeeded = false;
            }

            if (nextUpdateNeeded){
                _playerOffsetSetter(-tdOffset);
                trRef.current.style.left = `${tdOffset}px`;
                SetPlannedTrMove(10);
            } else {
                if (!isRedrawPending) {
                    road_404.MoveRoad();
                    setRoad(road_404.Road);
                    isRedrawPending = true;
                }
            }
        }, timeout)
    }

    function PlayerOffsetSetterAction(playerOffsetSetter){
        _playerOffsetSetter = playerOffsetSetter;
    }

    useEffect(() => {
        isRedrawPending = false;
        return () => {
            trRef.current.style.left = `${tdOffset}px`;
            _playerOffsetSetter(-tdOffset);
        }
    })


    SetPlannedTrMove(100);

    let player_OnJump = ()=>{};

    function OnKeyDown(event) {
        if (event.code === "Space"){
            player_OnJump()
            //alert("Space")
        }
        console.log(event)
    }


    function GetOnJumpFunction(playerOnJump){
        player_OnJump = playerOnJump;
    }

    return (
        <table onKeyDown={OnKeyDown} tabIndex={0}>
            <tbody>
                <tr ref={trRef}>
                    <Road_404_Generator
                        getTdSizeAction={GetTdSize}
                        road={road}
                        playerOffsetSetterAction={PlayerOffsetSetterAction}
                        onJumpGetterFunction={GetOnJumpFunction}
                    ></Road_404_Generator>
                </tr>
            </tbody>
        </table>)
}
export default Road_404