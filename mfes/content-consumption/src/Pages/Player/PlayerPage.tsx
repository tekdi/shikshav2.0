import React from 'react';
import { useLocation } from 'react-router-dom';
import { SunbirdPlayer } from '@shared-lib';

export default function PlayerPage() {
  const location = useLocation();
  const { identifier } = location.state || {};
  return identifier ? (
    <SunbirdPlayer identifier="do_21421049808039936017" />
  ) : (
    <div>No identifier provided</div>
  );
}
