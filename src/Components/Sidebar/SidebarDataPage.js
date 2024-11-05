import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as RiIcons from 'react-icons/ri';
import { FaLocationDot, FaMessage } from 'react-icons/fa6';
import { MdCallEnd } from 'react-icons/md';
import { IoSettings, IoLogOutOutline } from 'react-icons/io5';
import { BsFillGeoFill } from "react-icons/bs";
import { LiaHistorySolid } from 'react-icons/lia';
import { GiSatelliteCommunication } from "react-icons/gi";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const SidebarDataPage = () => {
  
  const navigate = useNavigate();
  const CookieName = "mobile_tracker";

  const logOutCall = async () => {
    Cookies.remove(CookieName);
    await new Promise(resolve => setTimeout(resolve, 500));
    navigate("/");
  };

  const iconColor = { color: '#9cf2ff' };

  const SidebarData = [
    {
      title: 'Dashboard',
      path: '/home',
      onClick: '',
      icon: <AiIcons.AiFillHome style={iconColor} />
    },
    {
      section: 'Map'
    },
    {
      title: <span style={{ fontSize: '14px' }}>Location</span>,
      icon: <FaLocationDot style={iconColor} />,
      iconClosed: <RiIcons.RiArrowDownSFill style={iconColor} />,
      iconOpened: <RiIcons.RiArrowUpSFill style={iconColor} />,
      subNav: [
        {
          title: 'Geofencing',
          path: "/geofencing",
          icon: <BsFillGeoFill style={iconColor} />
        },
        {
          title: 'History',
          path: '/history',
          icon: <LiaHistorySolid style={iconColor} />
        },
      ]
    },
    {
      title: 'Communication ',
      icon: <GiSatelliteCommunication style={iconColor} />,
      iconClosed: <RiIcons.RiArrowDownSFill style={iconColor} />,
      iconOpened: <RiIcons.RiArrowUpSFill style={iconColor} />,
      subNav: [
        {
          title: 'Call logs',
          path: '/call-logs',
          icon: <MdCallEnd style={iconColor} />,
          cName: 'sub-nav'
        },
        {
          title: 'Message logs',
          path: '/message-logs',
          icon: <FaMessage style={iconColor} />,
          cName: 'sub-nav'
        }
      ]
    },
    {
      section: 'System Settings'
    },
    {
      title: 'System Settings',
      path: '/system-setting',
      icon: <IoSettings style={iconColor} />
    },
    {
      section: 'Logout'
    },
    {
      title: 'Logout',
      onClick: logOutCall,
      icon: <IoLogOutOutline style={iconColor} />
    }
  ];

  return SidebarData;
};

export default SidebarDataPage;
