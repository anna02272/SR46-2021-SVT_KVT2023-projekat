package com.ftn.socialNetwork.service.implementation;

import com.ftn.socialNetwork.model.entity.Post;
import com.ftn.socialNetwork.repository.PostRepository;
import com.ftn.socialNetwork.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    public PostServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public Post updatePost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public Post deletePost(Long id) {
        postRepository.deleteById(id);
        return null;
    }

    @Override
    public Post findOneById(Long id) throws ChangeSetPersister.NotFoundException {
        return postRepository.findById(id)
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException());
    }

    @Override
    public List<Post> findAll() {
        return postRepository.findAll();
    }
}
