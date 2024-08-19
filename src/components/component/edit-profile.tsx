import React, { useState } from 'react';
import { storage } from '@/lib/firebase'; // Ensure you import your Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/app/auth/AuthContext'; // Import your auth context
import Image from 'next/image';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';

interface EditProfileProps {
  setIsEditing: (isEditing: boolean) => void;
  displayName: string;
  email: string;
  avatarUrl: string | null;
}

export const EditProfile: React.FC<EditProfileProps> = ({ setIsEditing, displayName, email, avatarUrl }) => {
  const { user } = useAuth(); // Get the authenticated user from context
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewAvatar(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newAvatar && user) { // Ensure `user` is defined and authenticated
      try {
        setUploading(true);
        console.log('User:', user); // Check if user is defined
        console.log('File Path:', `avatars/${user.uid}/${newAvatar.name}`);
        const avatarRef = ref(storage, `avatars/${user.uid}/${newAvatar.name}`);
        await uploadBytes(avatarRef, newAvatar);
        const url = await getDownloadURL(avatarRef);

        // Update the user's profile with the new avatar URL
        await updateProfile(user, { photoURL: url });
        await setDoc(doc(db, 'users', user.uid), {
          displayName: newDisplayName,
          email: user.email,
          avatarUrl: url,
        }, { merge: true });

        console.log('Profile updated with new avatar URL');
      } catch (error) {
        console.error('Error uploading avatar:', error);
      } finally {
        setUploading(false);
      }
    } else {
      console.error('User not authenticated or no avatar selected');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Display Name:
            <input type="text" value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            New Avatar:
            <input type="file" onChange={handleAvatarChange} />
          </label>
          {avatarUrl && (
            <img
              src={avatarUrl || "/placeholder-user.jpg"}
              alt="User Avatar"
              width={48} // Adjust the width as needed
              height={48} // Adjust the height as needed
            />
          )}
        </div>
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save'}
        </button>
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
};
